;(function(){

    // ARMAZENAR DOM NAS VARIAVEIS
    const frmTodoAdd = document.getElementById('todo-add')
    const itemInputAdd = document.getElementById('item-input')
    const ulTodoList = document.getElementById('todo-list')
    const lisTodos = ulTodoList.getElementsByTagName('li')
    
    // Objeto que salva os dados
    let arrTask = getSavedData()

    function getSavedData() {
        // Cria uma chave para salvar os dados
        let tasksData = localStorage.getItem('tasks')
        tasksData = JSON.parse(tasksData)   
        return (tasksData !== undefined && tasksData !== null) ? tasksData : [
            {
                name: 'Task 1',
                createAt: Date.now(),
                completed: false
            }
        ]
    }

    function setNewData() {
        // Atualiza os dados no Obheto
        localStorage.setItem('tasks', JSON.stringify(arrTask))
    }

    function generateLiTask(obj) {
        // Gera uma task HTML
        const li = document.createElement('li')
        const p = document.createElement('p')
        const buttonCheck = document.createElement('button')
        const check = document.createElement('i')
        const btnEdit = document.createElement('i')
        const btnDel = document.createElement('i')

        li.classList.add('todo-item')
        li.appendChild(buttonCheck)

        p.classList.add('task-name')
        li.appendChild(p)

        buttonCheck.classList.add('button-check')
        buttonCheck.setAttribute('data-action', 'check')
        check.setAttribute('data-action', 'check')
        buttonCheck.appendChild(check)

        btnEdit.classList.add('fas', 'fa-edit')
        btnEdit.setAttribute('data-action', 'edit')
        li.appendChild(btnEdit)

        const containerEdit = document.createElement('div')
        containerEdit.classList.add('editContainer')
        const inputEdit = document.createElement('input')
        inputEdit.setAttribute('type', 'text')
        inputEdit.classList.add('editInput')
        containerEdit.appendChild(inputEdit)
        const containerBtnEdit = document.createElement('button')
        containerBtnEdit.classList.add('editButton')
        containerBtnEdit.textContent = 'Edit'
        containerBtnEdit.setAttribute('data-action', 'containerBtnEdit')
        containerEdit.appendChild(containerBtnEdit)
        const containerBtnCancel = document.createElement('button')
        containerBtnCancel.classList.add('cancelButton')
        containerBtnCancel.textContent = 'Cancel'
        containerBtnCancel.setAttribute('data-action', 'containerBtnCancel')
        containerEdit.appendChild(containerBtnCancel)

        li.appendChild(containerEdit)
        
        btnDel.classList.add('fas', 'fa-trash-alt')
        btnDel.setAttribute('data-action', 'delete')
        li.appendChild(btnDel)

        ulTodoList.appendChild(li)
        
        p.textContent = `${obj.name}`
        if ( obj.completed ) {
            check.classList.add('fas', 'fa-check')
        } else {
            check.classList.add('fas', 'fa-check', 'displayNone')
        }
        
        return li
    }

    function addTask(task) {
        // Adiciona uma nova tarefa na Array de Objetos e atualiza a chave de dados
        arrTask[arrTask.length] = {
            name: task,
            createAt: Date.now(),
            completed: false //Default false
        }
        setNewData()
        return arrTask[arrTask.length - 1]
    }

    function renderTask() {
        // Renderiza toda as listas de tarefas salvas
        ulTodoList.innerHTML = ''
        arrTask.forEach( taskObj => {
            ulTodoList.appendChild(generateLiTask(taskObj))
        })
    }

    function clickedUl(e) {
        // Funções de eventos e organização de qual taks está alterando
        const dataAction = e.target.getAttribute('data-action')
        if (!dataAction) return

        const currentLi = (e.target.parentNode.localName === 'li') ? e.target.parentNode : e.target.parentNode.parentNode
        const arrTaskIndex = Array.from(lisTodos).indexOf(currentLi)

        const actions = {
            check: function() {
                const check = (e.target.localName === 'i') ? e.target : e.target.querySelector('i') 
                if ( check.classList.contains('displayNone') ) {
                    arrTask[arrTaskIndex].completed = true
                } else {
                    arrTask[arrTaskIndex].completed = false
                }
                arrTask[arrTaskIndex].createAt = Date.now()
                setNewData()
                renderTask()
            
            },
            delete: function() {
                arrTask.splice(arrTaskIndex, 1)
                setNewData()
                renderTask()
            
            },
            edit: function() {
                ulTodoList.querySelectorAll('.editContainer').forEach( container => container.style.display = 'none' )
                currentLi.querySelector('.editContainer').style.display = 'flex'
                currentLi.querySelector('.editContainer .editInput').value = arrTask[arrTaskIndex].name
                currentLi.querySelector('.editContainer .editInput').focus()
            },
            containerBtnEdit: function() {
                const textInputEdit = currentLi.querySelector('.editContainer .editInput').value 
                arrTask[arrTaskIndex].name = textInputEdit
                arrTask[arrTaskIndex].createAt = Date.now()
                setNewData()
                renderTask()

            },
            containerBtnCancel: function() {
                currentLi.querySelector('.editContainer').style.display = 'none'
            }
        }

        if (actions[dataAction]) {
            actions[dataAction]()
        }
    }

    // Evento da página - Delegação de evento
    ulTodoList.addEventListener('click', clickedUl)
    
    frmTodoAdd.addEventListener('submit', (e) => {
        // ENVIAR UMA NOVA TASK
        let nameTask = itemInputAdd.value

        console.log(nameTask)
        
        addTask(nameTask)
        renderTask()

        itemInputAdd.value = ''
        itemInputAdd.focus()

        e.preventDefault()
    })

    //Renderiza tudo de inicio
    renderTask()

})()
