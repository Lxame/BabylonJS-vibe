// Функции для управления состоянием элементов интерфейса
export function disableLineInputs() {
    const lineInputs = ['line_x1', 'line_y1', 'line_z1', 'line_x2', 'line_y2', 'line_z2'];
    lineInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.disabled = true;
            input.style.backgroundColor = '#f0f0f0';
        }
    });
    const button = document.querySelector('button[onclick="createLineFromInputs()"]');
    if (button) {
        button.disabled = true;
        button.style.backgroundColor = '#cccccc';
    }
}

export function disableTriangleInputs() {
    const triangleInputs = ['plane_x1', 'plane_y1', 'plane_z1', 'plane_x2', 'plane_y2', 'plane_z2', 'plane_x3', 'plane_y3', 'plane_z3'];
    triangleInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.disabled = true;
            input.style.backgroundColor = '#f0f0f0';
        }
    });
    const button = document.querySelector('button[onclick="createPlaneFromInputs()"]');
    if (button) {
        button.disabled = true;
        button.style.backgroundColor = '#cccccc';
    }
}

export function enableAllInputs() {
    const allInputs = document.querySelectorAll('input[type="number"]');
    allInputs.forEach(input => {
        input.disabled = false;
        input.style.backgroundColor = 'white';
    });

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.id !== 'clearButton') {
            button.disabled = false;
            if (button.onclick.toString().includes('createLineFromInputs')) {
                button.style.backgroundColor = '#4CAF50';
            } else if (button.onclick.toString().includes('createPlaneFromInputs')) {
                button.style.backgroundColor = '#4CAF50';
            }
        }
    });
}