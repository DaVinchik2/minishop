#!/usr/bin/env python3
"""MiniShop Telegram Bot — long polling version (no webhook/SSL needed)"""

import json
import logging
import time
import requests

# ===== CONFIG =====
BOT_TOKEN = "8679348399:AAFguQ3hBAO0ySBWSdBUa5L6yK9slASCJOo"
APP_URL = "https://davinchik2.github.io/minishop/"

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

BASE = f"https://api.telegram.org/bot{BOT_TOKEN}"

def api(method, **params):
    resp = requests.post(f"{BASE}/{method}", json=params, timeout=30)
    data = resp.json()
    if not data.get("ok"):
        log.error(f"API error {method}: {data}")
    return data

def send(chat_id, text, markup=None):
    params = {"chat_id": chat_id, "text": text, "parse_mode": "HTML"}
    if markup:
        params["reply_markup"] = json.dumps(markup)
    return api("sendMessage", **params)

def answer_cb(cb_id):
    return api("answerCallbackQuery", callback_query_id=cb_id)

# Keyboards
def main_kb():
    return {"inline_keyboard": [[{"text": "🛍️ Открыть магазин", "web_app": {"url": APP_URL}}]]}

# ===== COMMAND REGISTRY =====
COMMANDS = {
    "start": "Запустить бота",
    "shop": "Открыть магазин",
    "help": "Помощь",
}

def set_commands():
    cmds = [{"command": k, "description": v} for k, v in COMMANDS.items()]
    api("setMyCommands", commands=cmds)
    log.info("Bot commands registered")

def handle(msg):
    chat_id = msg["chat"]["id"]
    text = msg.get("text", "")

    if text in ("/start", "/shop"):
        send(chat_id,
            "👋 Добро пожаловать в <b>MiniShop</b>!\n\n"
            "🛍️ Нажмите кнопку ниже, чтобы открыть магазин.\n"
            "Добавьте товары в корзину и оформите заказ!\n\n"
            "📦 Доставка по всей России",
            markup=main_kb()
        )
    elif text == "/help":
        send(chat_id,
            "📖 <b>Команды:</b>\n\n"
            "/start — начать\n"
            "/shop — открыть магазин\n"
            "/help — справка\n\n"
            "🛍️ Для заказа откройте магазин и нажмите «Оформить заказ» в корзине."
        )
    else:
        send(chat_id, "Выберите действие 👇", markup=main_kb())

def handle_callback(cq):
    chat_id = cq["message"]["chat"]["id"]
    cb_id = cq["id"]
    cb_data = cq.get("data", "")
    answer_cb(cb_id)
    send(chat_id, "🛍️ Откройте магазин для просмотра и заказа товаров:", markup=main_kb())

def handle_webapp(msg):
    chat_id = msg["chat"]["id"]
    user = msg.get("from", {})
    wad = msg.get("web_app_data", {})
    raw = wad.get("data", "")

    try:
        order = json.loads(raw)
    except json.JSONDecodeError:
        send(chat_id, "❌ Ошибка обработки заказа")
        return

    name = order.get("name", "—")
    phone = order.get("phone", "—")
    comment = order.get("comment", "—") or "—"
    total = order.get("total", 0)
    items = order.get("items", [])

    items_text = "\n".join(
        f"  • {i['title']} × {i['qty']} = {i['price'] * i['qty']:,} ₽".replace(",", " ")
        for i in items
    )

    order_msg = (
        f"🆕 <b>НОВЫЙ ЗАКАЗ!</b>\n\n"
        f"👤 Имя: <b>{name}</b>\n"
        f"📞 Телефон: <code>{phone}</code>\n"
        f"💬 Комментарий: {comment}\n\n"
        f"📦 <b>Товары:</b>\n{items_text}\n\n"
        f"💰 <b>Итого: {total:,} ₽</b>\n"
        f"━━━━━━━━━━━━━━\n"
        f"🆔 User: {user.get('id')} | @{user.get('username', 'нет')}"
    ).replace(",", " ")

    # Confirm to buyer
    send(chat_id, f"✅ <b>Заказ принят!</b>\nМы свяжемся с вами для подтверждения.\n\n{order_msg}")

    # Forward to owner
    send(chat_id, order_msg)  # Отправит самому себе, для продавца нужен OWNER_ID
    log.info(f"✅ Order: {name} | {phone} | {total} RUB | @{user.get('username')}")

# ===== MAIN LOOP =====
def main():
    set_commands()
    log.info("🚀 MiniShop Bot started (long polling)")
    offset = 0

    while True:
        try:
            resp = api("getUpdates", offset=offset, timeout=30, allowed_updates=["message", "callback_query"])
            updates = resp.get("result", [])

            for upd in updates:
                offset = upd["update_id"] + 1

                if "message" in upd:
                    msg = upd["message"]
                    if "web_app_data" in msg:
                        handle_webapp(msg)
                    elif "text" in msg:
                        handle(msg)
                elif "callback_query" in upd:
                    handle_callback(upd["callback_query"])

        except KeyboardInterrupt:
            log.info("Bot stopped")
            break
        except Exception as e:
            log.error(f"Error: {e}")
            time.sleep(3)

if __name__ == "__main__":
    main()
