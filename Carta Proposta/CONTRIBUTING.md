# Guia de Contribuição e Workflow Git

Este documento descreve o fluxo de trabalho "Feature Branch" que adotamos para manter a qualidade e organização do código.

## 1. Visão Geral
*   **main**: Contém o código de produção estável. NUNCA faça commits diretamente aqui.
*   **feat/...**: Branches para novas funcionalidades (ex: `feat/nova-tela-login`).
*   **fix/...**: Branches para correção de bugs (ex: `fix/erro-validacao`).

## 2. Passo a Passo para Colaboradores

### Passo 1: Atualizar a Base
Antes de começar qualquer trabalho, garanta que você está na `main` atualizada.
```bash
git checkout main
git pull origin main
```

### Passo 2: Criar uma Branch
Crie uma branch com um nome descritivo para sua tarefa.
```bash
# Para nova funcionalidade
git checkout -b feat/nome-da-funcionalidade

# Para correção de bug
git checkout -b fix/descricao-do-bug
```

### Passo 3: Desenvolver e Commitar
Faça suas alterações e crie commits pequenos e descritivos.
```bash
git add .
git commit -m "feat: adiciona componente de botão"
```

### Passo 4: Enviar para o GitHub
Envie sua branch para o repositório remoto.
```bash
git push -u origin feat/nome-da-funcionalidade
```

### Passo 5: Criar Pull Request (PR)
1.  Vá até o repositório no GitHub.
2.  Você verá um aviso perguntando se quer criar um Pull Request para sua branch recente.
3.  Clique em **"Compare & pull request"**.
4.  Descreva o que foi feito.
5.  Adicione revisores (Reviewers) se necessário.
6.  Clique em **Create pull request**.

### Passo 6: Code Review e Merge
1.  Outro desenvolvedor (ou o tech lead) revisa o código.
2.  Se aprovado, o PR é mergeado na `main`.
3.  A branch da feature pode ser deletada após o merge.

## Boas Práticas
*   **Nunca commite senhas ou chaves de API** (use `.env`).
*   Mantenha commits atômicos (uma mudança lógica por commit).
*   Escreva mensagens de commit claras (preferencialmente em inglês ou português, seguindo um padrão).
