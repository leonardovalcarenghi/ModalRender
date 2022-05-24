/*!
 * Renderizador de modais para utilização no front-end.
 *
 * Leonardo J. Valcarenghi
 * Version: 4.0
 * Date: 11/05/2022
 * 
*/

const ModalsPath = './modals';
const ModalsContainer = document.getElementById("ModalsContainer");
const ClearOnHashChange = true;

if (ClearOnHashChange) {
    window.addEventListener('hashchange', function () {
        ModalsContainer.innerHTML = '';
    })
}

const ImportModal = function (path) {

    const req = new XMLHttpRequest();
    const randomNumber = (Math.floor(Math.random() * (10)) + 1);
    req.open('GET', `./${ModalsPath}/${path}.html?v=${randomNumber}`, false);
    req.send(null);
    if (req.status == 404) {
        throw { message: 'O arquivo da modal não foi encontrado.' };
    }

    if (req.status != 200) { return null; }
    if (!req.responseText) {
        throw { message: 'O arquivo da modal está vázio.' };
    }


    const htmlElement = document.createElement('div');
    htmlElement.innerHTML = req.responseText;

    // HTML / CSS / JS //
    const html = HTML(htmlElement);
    const id = html.getAttribute('id');
    const elementInDOM = document.getElementById(id);
    const style = Style(htmlElement, id);
    const styleInDOM = document.getElementById(`STYLE_MODAL_${id}`)
    const script = htmlElement.querySelector('script');
    if (!script) {
        throw { message: 'O arquivo não contém uma tag "script".' };
    }

    // Elementos //
    const elements = {};
    const inputs = {};
    const buttons = {};

    const inputsFound = html.querySelectorAll('input[name]');
    for (let index = 0; index < inputsFound.length; index++) {
        const element = inputsFound[index];
        const name = element.getAttribute('name');
        inputs[name] = element;
        elements[name] = element;
    }

    const buttonsFound = html.querySelectorAll('button[name]');
    for (let index = 0; index < buttonsFound.length; index++) {
        const element = buttonsFound[index];
        const name = element.getAttribute('name');
        buttons[name] = element;
        elements[name] = element;
    }


    // Parâmetros //
    const parameters = {

        // HTML Modal //
        This: elementInDOM,

        // Funções //
        OpenModal: (e) => {
            const modalInDOM = document.getElementById(id);
            if (modalInDOM == null) { return; }
            const bootstrapModal = new bootstrap.Modal(modalInDOM);
            bootstrapModal.show();
        },
        CloseModal: (e) => {
            const modalInDOM = document.getElementById(id);
            if (modalInDOM == null) { return; }
            const bootstrapModal = new bootstrap.Modal(modalInDOM);
            bootstrapModal.hide();
        },

        // Callbacks //
        OK: null,
        Cancel: null,

        // Elementos //
        Element: elements,
        Button: buttons,
        Input: inputs,
        ...elements

    }

    const parametersKeys = Object.keys(parameters); // Obter nomes dos parâmetros para a função anonima;
    const modalFunction = new Function(parametersKeys, script.innerHTML); // Declarar parâmetros da função anonima;

    let executedFunction = null;

    // Manipulador Externo //
    const handler = {

        ID: id,
        Element: elementInDOM,
        Style: styleInDOM,

        Open: async function () {
            const openParams = Array.from(arguments);

            // to do: verificar se a modal está aberta.

            return new Promise((resolve, reject) => {

                parameters.OK = (data) => {
                    if (typeof (executedFunction.OnClose) === 'function') { executedFunction.OnClose(); }

                    const modalInDOM = document.getElementById(id);
                    const bootstrapModal = new bootstrap.Modal(modalInDOM);
                    bootstrapModal.hide();
                    
                    resolve(data);
                };

                parameters.Cancel = (data) => {
                    if (typeof (executedFunction.OnClose) === 'function') { executedFunction.OnClose(); }
                    parameters.CloseModal();
                    reject(data)
                };

                parameters.OpenModal();

                const values = Object.values(parameters);
                executedFunction = modalFunction(...values);

                if (typeof (executedFunction.OnOpen) === 'function') { executedFunction.OnOpen(...openParams); }

            })

        },

        Close: function () {

            parameters.CloseModal();
            if (typeof (executedFunction.OnClose) === 'function') { executedFunction.OnClose(); }

        },

        // Reset: async function () {
        //     await GetModal(path, true);
        // }


    }




    return handler;


}


const HTML = function (element) {

    const html = element.querySelector('div.modal');
    if (!html) {
        throw { message: 'O arquivo não contém uma div com uma class "modal".' };
    }
    const id = html.getAttribute('id');

    const elementInDOM = document.getElementById(id);
    if (elementInDOM) { elementInDOM.remove(); }

    ModalsContainer.appendChild(html);
    return html;

}

const Style = function (element, id) {

    id = `STYLE_MODAL_${id}`;
    const style = element.querySelector('style');
  
    if (style) {
        const elementInDOM = document.getElementById(id);
        if (elementInDOM) { elementInDOM.remove(); }

        style.id = id;
        ModalsContainer.appendChild(style);
        return style;
    } else {
        return null;
    }

}

const GetElements = function (element) {

    return elements;
}

{



    const ImportModal = function (path) {
        return new Promise(async (resolve, reject) => {
            const req = new XMLHttpRequest();
            req.open('GET', `./${ModalsPath}/${path}.html?v=${RandomNumber}`, false);
            req.send(null);
            req.status == 200 ? resolve(req.responseText) : reject();

        })
    }

    const RenderModal = function () {

    }





    const GetModal = async function (path, forceRefresh = false) {
        return new Promise(async (resolve) => {

            debugger;

            // Modal //
            const modal = document.createElement('div');
            modal.innerHTML = await ImportModal(path);

            // HTML / CSS / JS //
            const html = HTML(modal);
            const id = html.getAttribute('id');
            const elementInDOM = document.getElementById(id);
            const style = Style(modal, id);
            const script = modal.querySelector('script');
            const elements = GetElements(html); // Buscar elementos da modal que contenham o atributo 'name';
            const bootstrapInstanceOfModal = new bootstrap.Modal(elementInDOM);

            // Parâmetros //
            const parameters = {

                // HTML Modal //
                This: elementInDOM,

                // Funções //
                OpenModal: (e) => { bootstrapInstanceOfModal.show(); },
                CloseModal: (e) => { bootstrapInstanceOfModal.hide(); },

                // Callbacks //
                OK: null,
                Cancel: null,

                // Elementos //
                ...elements
            }

            const parametersKeys = Object.keys(parameters); // Obter nomes dos parâmetros para a função anonima;
            const modalFunction = new Function(parametersKeys, script.innerHTML); // Declarar parâmetros da função anonima;

            let executedFunction = null;

            // Manipulador Externo //
            const callerModal = {

                Open: function () {
                    const openParams = Array.from(arguments);


                    inputVars.forEach(INPUT => { RemoveAllEvents(INPUT) });


                    // to do: verificar se a modal está aberta.

                    return new Promise((resolve, reject) => {

                        parameters.OK = (data) => {
                            if (typeof (executedFunction.OnClose) === 'function') { executedFunction.OnClose(); }
                            params.CloseModal();
                            resolve(data);
                        };

                        parameters.Cancel = (data) => {
                            if (typeof (executedFunction.OnClose) === 'function') { executedFunction.OnClose(); }
                            params.CloseModal();
                            reject(data)
                        };

                        parameters.OpenModal();

                        const values = Object.values(parameters);
                        executedFunction = modalFunction(...values);

                        if (typeof (executedFunction.OnOpen) === 'function') { executedFunction.OnOpen(...openParams); }

                    })

                },

                Close: function () {

                    parameters.CloseModal();
                    if (typeof (executedFunction.OnClose) === 'function') { executedFunction.OnClose(); }

                },

                Reset: async function () {
                    await GetModal(path, true);
                }


            }








            resolve(callerModal);


        })
    }


    window['GetModal'] = GetModal;
}








/*********************************************************************
 * RENDERIZADOR DE CONTEÚDO DA APLICAÇÃO 3.0 =========================
 * Criador: Leonardo Valcarenghi
*/


var ___modals_container = document.getElementById('ModalsContainer');
var ___styles_container = document.getElementById('StylesContainer');
var ___styles_modals_container = document.getElementById('StylesModalContainer');

/**
 * Importar modal.
 * @param {*} path Caminho relativo da modal.
 * @returns Retorna a instância do script referente à modal. 
 */
async function ImportModakl(path) {
    const get = async function () {
        return new Promise((resolve, reject) => {

        })
    }
    return new Promise(async (resolve) => {
        const response = await get();

        // Elemento //
        let element = document.createElement('div');
        element.innerHTML = response;

        // Modal //
        let modalElement = element.querySelector('.modal');
        let modalElementID = modalElement.getAttribute('id');
        if (!document.getElementById(modalElementID)) {
            ___modals_container.appendChild(modalElement);
        }

        // Style //
        let modalStyle = element.querySelector('style');
        if (modalStyle) {
            let modalStyleId = `STYLE_MODAL_${modalElementID}`;
            if (!document.getElementById(modalStyleId)) {
                modalStyle.id = modalStyleId;
                ___styles_modals_container.appendChild(modalStyle);
            }
        }

        // Script //
        let modalScript = element.querySelector('script');
        let modalClass = new Function('MODAL', modalScript.innerHTML);

        // Instância //
        let MODAL = jQuery(`#${modalElementID}`)
        MODAL['Open'] = function () { MODAL.modal('show'); }
        MODAL['Close'] = function () { MODAL.modal('hide'); }


        // Modal Static:
        jQuery('.modal[data-backdrop="static"]').unbind('click').on('click', (e) => {
            const element = jQuery(e.target);
            if (!element.hasClass('modal')) { return; }
            element.addClass('modal-static');
            setTimeout(() => {
                element.removeClass('modal-static');
            }, 300);
        })

        resolve(modalClass(MODAL))

    });
}

/**
 * Importar HTML de um componente.
 * @param {*} path  Caminho relativo do componente.
 * @returns Retorna uma string com o HTML do componente.
 */
async function ImportComponent(path) {
    const get = async function () {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            const version = Math.floor(Math.random() * (10)) + 1;
            req.open('GET', `./components/${path}.html?v=${version}`, true);
            req.send(null);
            req.onload = () => { resolve(req.responseText); }
            req.onerror = () => { reject(null); }
        })
    }
    return new Promise(async (resolve) => {
        const response = await get();

        // Elemento //
        let element = document.createElement('div');
        element.innerHTML = response;

        // Componente //
        let componentElement = element.querySelector('[component]');
        let componentName = componentElement.getAttribute('component');

        // Style //
        let componentStyle = element.querySelector('style');
        if (componentStyle) {
            let componentStyleId = `STYLE_COMPONENT_${componentName}`;
            if (!document.getElementById(componentStyleId)) {
                componentStyle.id = componentStyleId;
                ___styles_container.appendChild(componentStyle);
            }
        }

        resolve(element.innerHTML);
    });
}

/**
 * Renderizar componente a partir de um único item ou lista.
 * @param {*} html HTML do Componente (Utilize 'ImportComponent' para importar o HTML antes de renderizar)
 * @param {*} container Container onde o componente deve ser renderizado.
 * @param {*} data JSON ou Array Json com as informações a serem renderizadas no componente.
 */
async function RenderComponent(html, container, data) {
    return new Promise(async (resolve) => {
        if (Array.isArray(data)) {
            data.forEach(JSON => { $(html).tmpl(JSON).appendTo(container); })
        } else {
            $(html).tmpl(data).appendTo(container);
        }
        resolve();
    });
}

/**
 * Renderizar componente antes dos outros itens dentro de um container a partir de um único item ou lista.
 * @param {*} html HTML do Componente (Utilize 'ImportComponent' para importar o HTML antes de renderizar)
 * @param {*} container Container onde o componente deve ser renderizado.
 * @param {*} data JSON ou Array Json com as informações a serem renderizadas no componente.
 */
async function RenderComponentBefore(html, container, data) {
    return new Promise(async (resolve) => {
        if (Array.isArray(data)) {
            data.forEach(JSON => { $(html).tmpl(JSON).prependTo(container); })
        } else {
            $(html).tmpl(data).prependTo(container);
        }
        resolve();
    });
}




function RemoveAllEvents(element) {
    const events = getEventListeners(element);
    events.forEach(EVENT => {
        const type = EVENT.type;
        const listener = EVENT.listener;
        element.removeEventListener(type, listener, false);
    })
}