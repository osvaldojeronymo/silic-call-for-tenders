# Exemplo de Código Python para Redimensionar a Imagem
# Utilizando a biblioteca Pillow (PIL)

# -*- coding: utf-8 -*-
from PIL import Image

# Caminho para imagem de entrada
input_image_path = "/home/osvaldo/Downloads/imagens/imagem01.png"

# Caminho da imagem de saída (redimensionada)
output_image_path1 = "/home/osvaldo/Downloads/imagens/imagem01_resized_416x416.png"
output_image_path2 = "/home/osvaldo/Downloads/imagens/imagem01_resized_512x512.png"

# Tamanho de saída (exemplo: 416x416 para YOLO)
output_size_yolo = (416, 416)

# Tamanho de saída (exemplo: 512x512 para U-Net)
output_size_unet = (512, 512)

# Abrir a imagem original
image = Image.open(input_image_path)

# Redimensionar para YOLO (416x416)
resized_image_yolo = image.resize(output_size_yolo, Image.LANCZOS)
resized_image_yolo.save(output_image_path1)
print(f"Imagem salva com sucesso em: {output_image_path1}")

# Redimensionar para U-Net (512x512)
resized_image_unet = image.resize(output_size_unet, Image.LANCZOS)
resized_image_unet.save(output_image_path2)
print(f"Imagem salva com sucesso em: {output_image_path2}")

