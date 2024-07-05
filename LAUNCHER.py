import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
import requests
from io import BytesIO
import sys
import os

# URL base do repositório GitHub
BASE_URL = 'https://raw.githubusercontent.com/SEU_USUARIO/PROJETO-MANHATTAN/main/'

# Função para baixar uma imagem
def download_image(url):
    try:
        response = requests.get(url)
        return Image.open(BytesIO(response.content))
    except Exception as e:
        print(f"Erro ao baixar a imagem: {e}")
        return None

# Função para baixar arquivos do GitHub
def download_file_from_github(filename, dest_path):
    url = BASE_URL + filename
    response = requests.get(url)
    if response.status_code == 200:
        with open(dest_path, 'wb') as file:
            file.write(response.content)
        print(f"{filename} baixado com sucesso.")
        return True
    else:
        print(f"Falha ao baixar {filename}.")
        return False

# Função principal do launcher
def main():
    # Cria janela principal
    root = tk.Tk()
    root.title("PROJETO MANHATTAN")
    root.iconbitmap('ICONE.ico')  # Atualize para o ícone correto

    # Centralizar o launcher na tela
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()
    window_width = 800
    window_height = 600
    position_top = int(screen_height / 2 - window_height / 2)
    position_right = int(screen_width / 2 - window_width / 2)
    root.geometry(f"{window_width}x{window_height}+{position_right}+{position_top}")
    root.resizable(False, False)

    # Baixar a imagem de fundo
    background_url = "https://i.postimg.cc/HkFSzsBN/LAUNCHER.jpg"
    background_image = download_image(background_url)
    if background_image:
        root.background_photo = ImageTk.PhotoImage(background_image)
        background_label = tk.Label(root, image=root.background_photo)
        background_label.place(x=0, y=0, relwidth=1, relheight=1)

    # Frame central para os slides
    frame_width = 655
    frame_height = 350
    frame_x = (window_width - frame_width) // 2
    frame_y = (window_height - frame_height) // 2

    main_frame = tk.Frame(root, width=frame_width, height=frame_height)
    main_frame.place(x=frame_x, y=frame_y)

    # Adicionar a apresentação de slides
    canvas = tk.Canvas(main_frame, width=frame_width, height=frame_height, bg="white")
    canvas.pack()

    # URLs das imagens desejadas
    image_urls = [
        "https://i.postimg.cc/qM9xKDmc/FOTO-1-WELL-GRIDSTUDIO.jpg",
        "https://i.postimg.cc/5yWF0D9j/FOTO-2.jpg",
        "https://i.postimg.cc/MZ1Q4ZtB/FOTO-3.jpg",
        "https://i.postimg.cc/J4GW00gD/FOTO-4.jpg",
        "https://i.postimg.cc/Fs8XLm5P/FOTO-5.jpg",
        "https://i.postimg.cc/qqGXdpcp/FOTO-6.jpg",
        "https://i.postimg.cc/fRy76nVh/FOTO-7.jpg",
        "https://i.postimg.cc/J4155Bm0/FOTO-8.jpg",
    ]

    image_list = []
    for url in image_urls:
        img_data = download_image(url)
        if img_data:
            image_list.append(ImageTk.PhotoImage(img_data))
        else:
            print("Falha ao baixar a imagem. Verifique a URL fornecida.")

    current_image = 0

    def update_image():
        nonlocal current_image
        canvas.delete("all")
        canvas.create_image(frame_width // 2, frame_height // 2, image=image_list[current_image])
        current_image = (current_image + 1) % len(image_list)
        root.after(2000, update_image)  # Troca de imagem a cada 5 segundos

    update_image()

    # Botão START na cor branca
    start_button = tk.Button(root, text="START", command=lambda: start_loading(root), bg="white", fg="black", font=("Arial", 14, "bold"), width=10, height=1)
    start_button.place(relx=0.5, rely=0.9, anchor=tk.CENTER)

    root.mainloop()

# Função para iniciar o carregamento após clicar em START
def start_loading(root):
    start_button = root.children['!button']  # Encontrar o botão pelo seu nome padrão
    start_button.destroy()  # Remover o botão "START"
    
    progress_bar = ttk.Progressbar(root, orient="horizontal", mode="determinate", length=655, style="Custom.Horizontal.TProgressbar")
    progress_bar.place(relx=0.5, rely=0.9, anchor=tk.CENTER, y=-30)  # Posicionar acima do centro

    style = ttk.Style()
    style.theme_use('clam')
    style.configure("Custom.Horizontal.TProgressbar", troughcolor='blue', background='blue')

    status_label = tk.Label(root, text="BAIXANDO ATUALIZAÇÃO", bg="white", fg="black", font=("Arial", 12))
    status_label.place(relx=0.5, rely=0.85, anchor=tk.CENTER, y=-50)

    total_steps = 100  # Número total de passos para a barra de progresso
    step_duration = 15  # Duração de cada passo em milissegundos

    def update_progress(step):
        if step <= total_steps:
            progress_bar["value"] = step
            root.after(step_duration, update_progress, step + 1)
        else:
            status_label.config(text="LAUNCHER ATUALIZADO")
            root.after(1000, root.destroy)
            main()  # Chama o código principal após a barra de progresso terminar

    def download_updates():
        # Verifica se há atualizações para o script principal
        if download_file_from_github('LAUNCHER.py', 'LAUNCHER.py'):
            print("Script principal atualizado com sucesso.")
            # Reinicia o launcher para aplicar as atualizações
            restart_launcher()

        # Verifica se há atualizações para o arquivo VERSION.txt
        if download_file_from_github('VERSION.txt', 'VERSION.txt'):
            print("Arquivo VERSION.txt atualizado com sucesso.")

        # Verifica se há atualizações para as imagens de slides
        for i in range(1, 9):  # Atualiza imagens de FOTO-1 a FOTO-8
            image_filename = f'FOTO-{i}.jpg'
            if download_file_from_github(image_filename, image_filename):
                print(f"Imagem {image_filename} atualizada com sucesso.")

    root.after(0, download_updates)
    root.after(0, update_progress, 0)

# Função para reiniciar o launcher após atualizações
def restart_launcher():
    python = sys.executable
    os.execl(python, python, *sys.argv)

# Verifica e aplica as atualizações ao iniciar o launcher
main()
