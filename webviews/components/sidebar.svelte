<script>
    import listItem from './list_item.svelte'
</script>

<ul id="todo-list"></ul>

<style>
</style>

<script>
    let vscode;
    (function() {
            vscode = acquireVsCodeApi(); 
        }())

    // Handle the message inside the webview
    window.addEventListener('message', event => {

        const message = event.data; // The JSON data our extension sent
        const list = document.getElementById("todo-list");

        document.getElementById("todo-list").innerHTML = "";

        for (const element in message.list){
            list.appendChild(createMenuItem(message.list[element], message.lines[element]));
        }

        vscode.postMessage({command: 'alert'});
        console.log(message);
    });

    function createMenuItem(name, lineNumber) {
        let li = document.createElement('li');
        li.innerHTML = `<a id="${lineNumber}">${name}</a>`;

        li.addEventListener("click", lineClick);

        return li;
    }

    function lineClick(e){
    vscode.postMessage({
                        command: 'goto',
                        line: `${e.target.id}`
                    });
                   }

</script>