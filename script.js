document.addEventListener('DOMContentLoaded', () => {
    const stackSizeInput = document.querySelector('.stack-size');
    const pushInput = document.querySelector('.push');
    const popButton = document.querySelector('.pop');
    const peekButton = document.querySelector('.peek');
    const displayButton = document.querySelector('.display');
    const isEmptyButton = document.querySelector('.is-empty');
    const resetButton = document.querySelector('.reset');
    const messageBox = document.querySelector('.message');
    const topOfStack = document.querySelector('.top-stack');
    const lastPushedItem = document.querySelector('.pushed-item');
    const lastPoppedItem = document.querySelector('.popped-item');
    const maxSizeDisplay = document.querySelector('.max-size');
    const currentSize = document.querySelector('.current-size');
    const bucket = document.querySelector('.bucket');
    const undoButton = document.querySelector('.undo');
    const redoButton = document.querySelector('.redo');
    const randomizeButton = document.querySelector('.randomize');
    const toggleButton = document.querySelector('.keyboard-shortcut');
    const shortcutsSection = document.querySelector('.keyboard-shortcuts');

    // Stack and state variables
    let stack = [];
    let maxSize = 0;
    let lastPushed = null;
    let lastPopped = null;
    let undoStack = [];
    let redoStack = [];


    // Function to update the UI
    function updateUI() {
        topOfStack.textContent = stack.length > 0 ? stack[stack.length - 1] : '';
        lastPushedItem.textContent = lastPushed !== null ? lastPushed : '';
        lastPoppedItem.textContent = lastPopped !== null ? lastPopped : '';
        maxSizeDisplay.textContent = maxSize;
        currentSize.textContent = stack.length;

        // Update stack visualization
        bucket.innerHTML = '';
        stack.forEach((item, index) => {
            const stackItem = document.createElement('div');
            stackItem.className = 'stack-item';
            stackItem.textContent = item;
            stackItem.style.bottom = `${index * 50}px`;
            bucket.appendChild(stackItem);
        });

        bucket.style.backgroundColor = '#B7DBFF';
    }

    // Function to reset bucket color
    function resetBucketColor() {
        bucket.style.backgroundColor = '#B7DBFF';
    }

    // Function to save the current state for undo/redo
    function saveState() {
        if (undoStack.length >= 50) undoStack.shift();
        undoStack.push([...stack]);
        redoStack = [];
    }


    // Set stack size
    stackSizeInput.addEventListener('click', () => {
        const size = parseInt(stackSizeInput.previousElementSibling.value);
        if (size > 0) {
            maxSize = size;
            stack = [];
            lastPushed = null;
            lastPopped = null;
            messageBox.textContent = `Stack size set to ${maxSize}`;
            updateUI();

        } else {
            messageBox.textContent = 'Please enter a valid stack size.';
        }
    });


    // Push operation
    pushInput.addEventListener('click', () => {

        resetBucketColor(); 
        const value = parseInt(pushInput.previousElementSibling.value);

        if (isNaN(value)) {
            messageBox.textContent = 'Cannot push an empty value.';
            return;
        }

        if (maxSize === 0) {
            messageBox.textContent = 'Please set the stack size first.';
            return;
        }

        if (stack.length < maxSize) {
            saveState();
            stack.push(value);
            lastPushed = value;
            messageBox.textContent = `Pushed ${value} to the stack.`;
            updateUI();

        } else {
            messageBox.textContent = 'Stack is full. Cannot push more items.';
            bucket.style.backgroundColor = 'red';
        }
    });


    // Pop operation
    popButton.addEventListener('click', () => {
        resetBucketColor();
        if (stack.length > 0) {
            saveState();
            lastPopped = stack.pop();
            messageBox.textContent = `Popped ${lastPopped} from the stack.`;
            updateUI();

        } else {
            messageBox.textContent = 'Stack is empty. Cannot pop items.';
            bucket.style.backgroundColor = 'red';
        }
    });



    // Undo operation
    undoButton.addEventListener('click', () => {
        resetBucketColor();
        if (undoStack.length > 0) {
            redoStack.push([...stack]);
            stack = undoStack.pop();
            messageBox.textContent = 'Undo successful.';
            updateUI();
        } else {
            messageBox.textContent = 'Nothing to undo.';
        }
    });

    // Redo operation
    redoButton.addEventListener('click', () => {
        resetBucketColor();
        if (redoStack.length > 0) {
            undoStack.push([...stack]);
            stack = redoStack.pop();
            messageBox.textContent = 'Redo successful.';
            updateUI();
        } else {
            messageBox.textContent = 'Nothing to redo.';
        }
    });


    // Peek operation
    peekButton.addEventListener('click', () => {
        resetBucketColor();
        if (stack.length > 0) {
            messageBox.textContent = `Top of the stack is ${stack[stack.length - 1]}.`;
        } else {
            messageBox.textContent = 'Stack is empty.';
        }
    });


    // Display operation
    displayButton.addEventListener('click', () => {
        resetBucketColor();
        if (stack.length > 0) {
            messageBox.textContent = `Stack: ${stack.join(', ')}`;
        } else {
            messageBox.textContent = 'Stack is empty.';
        }
    });

    // Is Empty operation
    isEmptyButton.addEventListener('click', () => {
        resetBucketColor();
        messageBox.textContent = stack.length === 0 ? 'Stack is empty.' : 'Stack is not empty.';
    });


    // Reset operation
    resetButton.addEventListener('click', () => {
        resetBucketColor();
        stack = [];
        maxSize = 0;
        lastPushed = null;
        lastPopped = null;
        stackSizeInput.previousElementSibling.value = '';
        pushInput.previousElementSibling.value = '';
        messageBox.textContent = 'Stack has been reset.';
        updateUI();
    });


    // Randomize stack
    function randomizeStack() {

        resetBucketColor();
        if (maxSize === 0) {
            messageBox.textContent = 'Please set the stack size first.';
            bucket.style.backgroundColor = 'red';
            return;
        }

        saveState();
        stack = [];

        for (let i = 0; i < maxSize; i++) {
            stack.push(Math.floor(Math.random() * 100) + 1);
        }
        messageBox.textContent = 'Stack randomized with new values.';
        updateUI();
    }

    // Randomize button event listener
    if (randomizeButton) {
        randomizeButton.addEventListener('click', randomizeStack);
    } else {
        console.error('Randomize button not found in the HTML.');
    }


    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch (e.key.toLowerCase()) {
            case 'h': stackSizeInput.click(); break;
            case 'p': pushInput.click(); break;
            case 'o': popButton.click(); break;
            case 'd': resetButton.click(); break;
            case 'u': undoButton.click(); break;
            case 'r': redoButton.click(); break;
            case 's': randomizeButton.click(); break;
            case 'e': isEmptyButton.click(); break;
            case 'k': peekButton.click(); break;
            case 'l': displayButton.click(); break;
            case 'x': toggleButton.click(); break;
        }
    });

    // Toggle keyboard shortcuts visibility
    if (toggleButton && shortcutsSection) {
        toggleButton.addEventListener('click', () => {
            if (shortcutsSection.style.display === 'none' || shortcutsSection.style.display === '') {
                // Show shortcuts
                shortcutsSection.style.display = 'block';
                toggleButton.innerHTML = '<i class="fa-solid fa-xmark fa-lg"></i>';
            } else {
                // Hide shortcuts
                shortcutsSection.style.display = 'none';
                toggleButton.innerHTML = '<i class="fa-solid fa-keyboard"></i>';
            }
        });
    } else {
        console.error('Toggle button or keyboard shortcuts section not found.');
    }

    // Dark mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            themeToggle.src = body.classList.contains('dark-mode') ? 'Image/sun.svg' : 'Image/moon.svg';
        });
    }
});