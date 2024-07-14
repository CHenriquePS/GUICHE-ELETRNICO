from flask import render_template, request, redirect, url_for
from app import app

fila_normal = []
fila_urgente = []
fila_emergencial = []

# Urgência baseada na idade e condição de gestante
def determinar_urgencia(idade, gestante):
    if gestante or idade >= 80:
        return 'emergencial'
    elif idade < 1 or idade > 60:
        return 'emergencial'
    elif 1 <= idade <= 12 or 50 <= idade <= 60:
        return 'urgente'
    else:
        return 'normal'

# Página inicial
@app.route('/')
def index():
    return render_template('index.html')

# Emitir senha
@app.route('/emitir_senha', methods=['POST'])
def emitir_senha():
    idade = int(request.form['idade'])
    gestante = 'gestante' in request.form
    urgencia = determinar_urgencia(idade, gestante)
    paciente = {
        'nome': request.form['nome'],
        'cpf': request.form['cpf'],
        'idade': idade,
        'gestante': gestante,
        'urgencia': urgencia
    }
    if urgencia == 'normal':
        fila_normal.append(paciente)
        senha = len(fila_normal)
    elif urgencia == 'urgente':
        fila_urgente.append(paciente)
        senha = len(fila_urgente)
    else:
        fila_emergencial.append(paciente)
        senha = len(fila_emergencial)

    return redirect(url_for('mostrar_urgencia', nome=paciente['nome'], urgencia=paciente['urgencia'], senha=senha))

# Exibir urgência
@app.route('/mostrar_urgencia')
def mostrar_urgencia():
    nome = request.args.get('nome')
    urgencia = request.args.get('urgencia')
    senha = request.args.get('senha')
    return render_template('urgencia.html', nome=nome, urgencia=urgencia, senha=senha)

# Exibir fila de espera
@app.route('/fila')
def exibir_fila():
    return render_template('fila.html', fila_normal=fila_normal, fila_urgente=fila_urgente, fila_emergencial=fila_emergencial)
