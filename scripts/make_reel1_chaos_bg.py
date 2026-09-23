#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Генерация «хаос-фона» для Reel #1 (9:16, 720x1280)
Тёмный command-center, который символизирует «день собственника»:
каша задач, уведомления, просроченное, бегущие цифры, тревожные метки.
Выход: /home/hermes/businessdoc/assets/reel1_chaos_bg.png
"""
from PIL import Image, ImageDraw, ImageFont
import random, math

W, H = 720, 1280
random.seed(42)

BG = (12, 18, 28)
CARD = (20, 30, 44)
CARD2 = (24, 36, 52)
RED = (248, 70, 70)
AMBER = (240, 165, 40)
GREEN = (60, 200, 130)
CYAN = (60, 190, 230)
TEXT = (230, 238, 246)
DIM = (120, 135, 155)
BORDER = (40, 56, 78)

def font(sz):
    return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", sz)

img = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(img)

# ---- Заголовок вверху: тревожный статус-бар ----
d.rectangle([0, 0, W, 60], fill=CARD)
d.rectangle([0, 0, 8, 60], fill=RED)
d.text((28, 14), "COMMAND CENTER  ·  LIVE", fill=CYAN, font=font(26))
# красный индикатор «проблема»
d.ellipse([W-40, 22, W-14, 48], fill=RED)
d.text((W-130, 20), "ХАОС", fill=RED, font=font(22))

# ---- Правая колонка: «горящие» метрики ----
def metric_card(x, y, title, val, delta, col):
    d.rounded_rectangle([x, y, x+150, y+90], radius=12, fill=CARD, outline=BORDER)
    d.text((x+10, y+8), title, fill=DIM, font=font(16))
    d.text((x+10, y+38), val, fill=(255,255,255), font=font(26))
    d.text((x+10, y+66), delta, fill=col, font=font(15))

metric_card(560, 90,  "Задачи",   "47",   "+19", RED)
metric_card(560, 205, "Обращения","23",   "+31", RED)
metric_card(560, 320, "Просрочено","14", "СТОП", AMBER)
metric_card(560, 435, "Согласовать","9", "ТРЕБУЕТ", AMBER)
metric_card(560, 550, "Не прочитано","18","ВНИМАНИЯ", RED)

# ---- Левая/центр: «каша» из пунктов ----
d.rounded_rectangle([30, 90, 530, 1200], radius=16, fill=CARD2, outline=BORDER)
d.text((50, 100), "◼ НЕЗАКРЫТЫЙ ДЕНЬ", fill=DIM, font=font(18))

tasks = [
    ("Позвонить поставщику", RED, "ПРОСРОЧЕНО"),
    ("Согласовать счёт №2281", AMBER, "ждёт 3 дня"),
    ("Ответить клиенту — 14:20", RED, "НЕ ОТВЕТИЛ"),
    ("Проверить отчёт менеджера", AMBER, "в процессе"),
    ("Цены конкурента", CYAN, "изменились ×7"),
    ("Заявка на склад", RED, "ТРЕБУЕТ РЕШЕНИЯ"),
    ("Нанять сотрудника", AMBER, "не найден"),
    ("Утрясти платёж", RED, "просрочен"),
    ("Подготовить тендер", DIM, "забыт"),
    ("Бухгалтер просит данные", AMBER, "нет времени"),
    ("Реклама на паузе", CYAN, "кто возобновит?"),
    ("Договор не подписан", RED, "3 дня"),
    ("Возврат товара", AMBER, "разобраться"),
    ("Вывезти брак", DIM, "некому"),
    ("Обновить карточки", CYAN, "отложено"),
    ("СК: нужно решение", RED, "СЕГОДНЯ"),
    ("ИИ-агент просит правила", AMBER, "какие?"),
    ("Написать ТЗ", DIM, "нет времени"),
    ("Проверить склад", AMBER, "вчера"),
    ("50 задач на завтра", RED, "ГОРА"),
]

# «наклонная» каша с лёгким поворотом текста и случайностью
y = 140
for t, col, tag in tasks:
    # иногда красная точка слева (незакрытое)
    d.ellipse([40, y+10, 52, y+22], fill=col)
    d.text((62, y+4), t, fill=(235,240,248), font=font(20))
    d.text((440, y+4), tag, fill=col, font=font(15))
    y += 56

# бегущая строка снизу
d.rectangle([0, 1210, W, 1280], fill=(16,24,36))
d.text((24, 1218), "Обработано 12 из 47 · Нерешённых 31 · В отложенных 9 · контекст меняется каждые 3 мин", fill=AMBER, font=font(18))

img.save("/home/hermes/businessdoc/assets/reel1_chaos_bg.png")
print("OK:", "/home/hermes/businessdoc/assets/reel1_chaos_bg.png", img.size)