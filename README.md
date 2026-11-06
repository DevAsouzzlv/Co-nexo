# Co.Nexo — Sistema de Mentorias SENAC (MVP)

> **MVP Enxuto e Funcional**: Projetado para eliminar 100% das planilhas de Excel avulsas, preencher a grade das consultoras sem buracos de 1h e garantir a prestação de contas com a diretoria do SENAC.

---

## 🚀 Como Executar o Projeto

No terminal dentro da pasta do projeto (`c:\Users\Aluno Tarde\Documents\Co-nexo`):

```bash
# Iniciar o servidor de desenvolvimento
npm run dev
```

Abra o link gerado no navegador (geralmente `http://localhost:5173`).

---

## 👥 Persona Switcher (Simulação dos 4 Atores)

No topo do sistema você encontra uma barra para alternar instantaneamente entre os 4 perfis:

1. **🏢 Max (Recepção & Operação)**:
   - **Cadastrar Novo Mentorado:** Formulário completo para inclusão de novos empreendedores (nome, negócio, WhatsApp, CPF, situação Informal ou MEI com CNPJ e ícone do negócio).
   - **Grade Inteligente de 4 Horas:** Visualização do turno de 4h das consultoras com trava antiburaco ocioso (validação de combinações $4\times 1\text{h}$, $2\times 2\text{h}$ ou $2\times 1\text{h} + 1\times 2\text{h}$).
   - **Ações Rápidas de Presença:** Marcar reunião realizada, falta com $<24\text{h}$ (que aplica penalidade na régua) ou falta justificada.
   - **Fila Anti-Limbo:** Lista automática de empreendedores que concluíram o 5º encontro e precisam de contato nos marcos D+30 e D+60 para formalização do MEI (com botão direto para WhatsApp).
   - **Tabela de Empreendedores:** Indicador visual de faltas/reagendamentos e alerta de desligamento imediato.

2. **👩‍🏫 Aline (Mentora / Consultora)**:
   - **Agenda Semanal Consolidada:** Turnos fechados de 4 horas sem furos.
   - **Prontuário Digital Único ("Diário de Bordo"):** Acesso em menos de 15 segundos ao histórico pedagógico do aluno, resumo da última sessão, tarefas combinadas e anexo de links e materiais didáticos.

3. **👨‍🍳 Arthur (Mentorado / Aluno)**:
   - **Painel do Empreendedor ("Meu Plano de Ação"):** Detalhes da próxima mentoria agendada.
   - **Régua Transparente de Assiduidade:** Saldo claro de faltas e reagendamentos restantes.
   - **Checklist Interativo de Tarefas:** Tarefas combinadas com a Aline para o próximo encontro.
   - **Materiais Recomendados:** Acesso às planilhas e guias oficiais de MEI.
   - **Botão Direto no WhatsApp:** Permite tirar dúvidas sem a complexidade de um chat pesado no MVP.

4. **📊 Regis (Coordenação Geral / Diretoria)**:
   - **Dashboard Executivo em Tempo Real:** 4 indicadores principais (Total de Empreendedores, Horas de Consultoria Realizadas, Conversão em MEI e Taxa de No-Show).
   - **Relatório em 1 Clique:** Botão para exportar relatório completo em arquivo CSV/Excel para prestação de contas à diretoria do SENAC.
   - **Auditoria de Prontuários:** Visualização de todos os diários de bordo preenchidos.

---

## 🔒 Segurança de Dados & Backup
- **Persistência Centralizada:** Todos os dados são sincronizados no armazenamento local com garantia de integridade.
- **Botão "Backup" no Cabeçalho:** Exporta um arquivo `.json` completo com 1 clique a qualquer momento.
- **Botão "Resetar Demo":** Restaura o estado inicial do sistema para novas demonstrações ou testes.
