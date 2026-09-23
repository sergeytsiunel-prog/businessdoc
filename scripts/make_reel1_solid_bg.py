#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Фон А v2 — «ты в правой части кадра».
Логотип сверху (BUSINESS DOCTOR + слоган слева-центр), правая часть тёмная свободная
под Сергея. Вертикаль 720x1280.
Выход: /home/hermes/businessdoc/assets/reel1_solid_bg.png
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 720, 1280
TOP = (12, 16, 24)
BOT = (8, 12, 18)

def font(sz, bold=False):
    path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    if bold:
        path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    return ImageFont.truetype(path, sz)

# градиент графит
img = Image.new('RGB', (W, H)); px = img.load()
for y in range(H):
    t = y / H
    r = int(TOP[0] + (BOT[0]-TOP[0])*t)
    g = int(TOP[1] + (BOT[1]-TOP[1])*t)
    b = int(TOP[2] + (BOT[2]-TOP[2])*t)
    for x in range(W):
        px[x, y] = (r, g, b)
d = ImageDraw.Draw(img)

def txt(x, y, s, fon, col):
    d.text((x, y), s, font=fon, fill=col)

# --- В самом верху: логотип слева-центр (BUSINESS / DOCTOR две строки) ---
txt(50, 56,  "BUSINESS", font(72, True), (235, 242, 250))
txt(50, 132, "DOCTOR",   font(72, True), (70, 180, 255))

# маленький докторский плюс-значок слева от DOCTOR
# круг тёмный + крест синий
cx, cy, rad = 28, 168, 22
d.ellipse([cx-rad, cy-rad, cx+rad, cy+rad], fill=(40, 70, 110), outline=(70,180,255), width=3)
d.line([(cx, cy-12), (cx, cy+12)], fill=(70,180,255), width=4)
d.line([(cx-12, cy), (cx+12, cy)], fill=(70,180,255), width=4)

# --- Слоган под лого (слева), висит постоянно ---
txt(50, 250, "ИИ умножит твой хаос на 10", font(30, True), (250, 200, 60))
txt(50, 295, "Прежде чем автоматизировать — устрани хаос.", font(20), (150, 165, 185))

# разделитель-линия внизу под Сергеем
d.line([(30, 1230), (330, 1230)], fill=(50, 80, 110), width=2)
txt(30, 1240, "B U S I N E S S   D O C T O R", font(18), (90, 110, 135))

# ПРАВАЯ ЧАСТЬ: намеренно тёмная, без текста — туда встаёт Сергей.
# лёгкая тонкая рамка-свечение справа, чтобы обозначить зону кадра
d.rectangle([W-40, 0, W-3, H], fill=(16, 24, 36))
d.line([(W-40, 0), (W-40, H)], fill=(55, 85, 115), width=3)

img.save("/home/hermes/businessdoc/assets/reel1_solid_bg.png")
print("OK:", img.size)