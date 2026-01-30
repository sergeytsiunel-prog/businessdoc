# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os
import random

print("Создание изображения для Яндекс.Директ")
print("=" * 50)

# Загружаем фото
try:
    photo = Image.open('foto/photo_2026-01-13_19-19-47.jpg')
    print("✓ Фото загружено")
    
    # Обрезаем до квадрата
    width, height = photo.size
    min_dimension = min(width, height)
    left = (width - min_dimension) // 2
    top = (height - min_dimension) // 2
    right = left + min_dimension
    bottom = top + min_dimension
    
    photo_cropped = photo.crop((left, top, right, bottom))
    
    # Масштабируем
    photo_resized = photo_cropped.resize((600, 600), Image.Resampling.LANCZOS)
    
    # Улучшаем
    photo_enhanced = photo_resized.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
    enhancer = ImageEnhance.Color(photo_enhanced)
    photo_final = enhancer.enhance(1.1)
    
except Exception as e:
    print(f"Ошибка загрузки фото: {e}")
    photo_final = None

# Создаем изображение
img = Image.new('RGB', (1200, 628), color=(255, 255, 255))
draw = ImageDraw.Draw(img)

# Градиентный фон
for i in range(628):
    progress = i / 628
    r = int(58 * (1 - progress) + 255 * progress)
    g = int(123 * (1 - progress) + 255 * progress)
    b = int(213 * (1 - progress) + 255 * progress)
    draw.line([(0, i), (1200, i)], fill=(r, g, b))

# Добавляем фото если есть
if photo_final:
    # Круглая маска
    mask = Image.new('L', (600, 600), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([(0, 0), (598, 598)], fill=255)
    
    photo_round = Image.new('RGBA', (600, 600))
    photo_round.paste(photo_final, (0, 0), mask)
    
    # Размещаем справа
    img.paste(photo_round, (1200 - 650, 14), photo_round)

# Шрифты
try:
    font_bold = ImageFont.truetype("arialbd.ttf", 72)
    font_regular = ImageFont.truetype("arial.ttf", 36)
    font_small = ImageFont.truetype("arial.ttf", 28)
except:
    font_bold = ImageFont.load_default()
    font_regular = ImageFont.load_default()
    font_small = ImageFont.load_default()

# Текст
# Логотип слева сверху - оба слова золотые
draw.text((50, 40), "BUSINESS", fill=(212, 175, 55), font=font_bold)  # золотой
draw.text((50, 120), "DOCTOR", fill=(212, 175, 55), font=font_bold)   # тоже золотой

# Тонкая синяя линия под текстом (опустить ниже)
draw.line([(50, 200), (400, 200)], fill=(58, 123, 213), width=2)

draw.text((50, 230), "Синтез управленческого", fill=(44, 62, 80), font=font_regular)
draw.text((50, 280), "опыта и мощь AI", fill=(44, 62, 80), font=font_regular)

draw.text((50, 550), "AI-диагностика утечек денег • businessdoc.pro", 
          fill=(100, 100, 120), font=font_small)

# Сохраняем
os.makedirs('direct_images', exist_ok=True)
output_path = 'direct_images/business_doctor_perfect.jpg'
img.save(output_path, 'JPEG', quality=95, optimize=True)

print(f"✅ Изображение создано: {output_path}")
print(f"📏 Размер: 1200×628 пикселей")

# Открываем
try:
    os.startfile(output_path)
    print("🖼️ Изображение открыто")
except:
    print(f"📁 Файл: {os.path.abspath(output_path)}")