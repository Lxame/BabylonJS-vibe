import { createAxes } from './utils/axes.js';
import { createPoint, createLine, createTriangle, clearLine, clearTriangle } from './utils/geometry.js';
import { debugLog } from './utils/debug.js';
import { disableLineInputs, disableTriangleInputs, enableAllInputs } from './utils/ui.js';

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Создаем камеру
const camera = new BABYLON.ArcRotateCamera("camera", 0, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

// Добавляем освещение
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

// Создаем координатные оси
createAxes(scene);

// Переменные для хранения текущей линии и треугольника
let currentLine = null;
let currentTriangle = null;
let currentPoints = [];
let allLines = [];

// Функция для создания отрезка по введенным координатам
window.createLineFromInputs = function () {
    // Очищаем только линию, если она есть
    currentLine = clearLine(currentLine);

    // Получаем значения координат
    const x1 = parseFloat(document.getElementById("line_x1").value) || 0;
    const y1 = parseFloat(document.getElementById("line_y1").value) || 0;
    const z1 = parseFloat(document.getElementById("line_z1").value) || 0;
    const x2 = parseFloat(document.getElementById("line_x2").value) || 0;
    const y2 = parseFloat(document.getElementById("line_y2").value) || 0;
    const z2 = parseFloat(document.getElementById("line_z2").value) || 0;

    // Создаем точки
    const point1 = createPoint(new BABYLON.Vector3(x1, y1, z1), scene, currentPoints);
    const point2 = createPoint(new BABYLON.Vector3(x2, y2, z2), scene, currentPoints);

    // Создаем линию
    currentLine = createLine(point1, point2, scene, allLines);

    // Отключаем ввод для линии
    disableLineInputs();
};

// Функция для создания треугольника по введенным координатам
window.createPlaneFromInputs = function () {
    try {
        // Очищаем только треугольник, если он есть
        currentTriangle = clearTriangle(currentTriangle);

        // Получаем значения координат
        const x1 = parseFloat(document.getElementById("plane_x1").value) || 0;
        const y1 = parseFloat(document.getElementById("plane_y1").value) || 0;
        const z1 = parseFloat(document.getElementById("plane_z1").value) || 0;
        const x2 = parseFloat(document.getElementById("plane_x2").value) || 0;
        const y2 = parseFloat(document.getElementById("plane_y2").value) || 0;
        const z2 = parseFloat(document.getElementById("plane_z2").value) || 0;
        const x3 = parseFloat(document.getElementById("plane_x3").value) || 0;
        const y3 = parseFloat(document.getElementById("plane_y3").value) || 0;
        const z3 = parseFloat(document.getElementById("plane_z3").value) || 0;

        // Создаем точки
        const point1 = createPoint(new BABYLON.Vector3(x1, y1, z1), scene, currentPoints);
        const point2 = createPoint(new BABYLON.Vector3(x2, y2, z2), scene, currentPoints);
        const point3 = createPoint(new BABYLON.Vector3(x3, y3, z3), scene, currentPoints);

        // Создаем треугольник
        currentTriangle = createTriangle(point1, point2, point3, scene);

        // Отключаем ввод для треугольника
        disableTriangleInputs();
    } catch (error) {
        alert('Error creating triangle: ' + error.message);
    }
};

// Функция для очистки всех объектов в сцене
window.clearScene = function () {
    // Удаляем все линии
    allLines.forEach(line => {
        if (line.material) {
            line.material.dispose();
        }
        line.dispose();
    });
    allLines = [];

    // Удаляем текущую линию
    currentLine = clearLine(currentLine);

    // Удаляем текущий треугольник
    currentTriangle = clearTriangle(currentTriangle);

    // Удаляем все точки
    currentPoints.forEach(point => {
        if (point.material) {
            point.material.dispose();
        }
        point.dispose();
    });
    currentPoints = [];

    // Убрал, тк меня бесило
    // Очищаем все поля ввода
    // const allInputs = document.querySelectorAll('input[type="number"]');
    // allInputs.forEach(input => {
    //     input.value = '';
    // });

    // Включаем все поля ввода
    enableAllInputs();
};

// Запускаем рендер
engine.runRenderLoop(function () {
    scene.render();
});

// Обработка изменения размера окна
window.addEventListener("resize", function () {
    engine.resize();
});