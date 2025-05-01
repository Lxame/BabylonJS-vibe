import { createAxes } from './utils/axes.js';
import { createPoint, createLine, createTriangle, clearLine, clearTriangle, checkLinePlaneIntersection } from './utils/geometry.js';
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
let linePoints = null;
let trianglePoints = null;
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
    linePoints = [point1.position, point2.position];
    // debugLog(currentLine);

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
        trianglePoints = [point1.position, point2.position, point3.position];
        // debugLog(currentTriangle);

        // Отключаем ввод для треугольника
        disableTriangleInputs();
    } catch (error) {
        alert('Error creating triangle: ' + error.message);
    }
};

window.checkIntersection = function () {
    try {
        debugLog(linePoints);
        debugLog(trianglePoints);
        const intersection = checkLinePlaneIntersection(linePoints[0], linePoints[1], trianglePoints[0], trianglePoints[1], trianglePoints[2]);
        debugLog(intersection.message);
        debugLog(intersection.point);


        const position = new BABYLON.Vector3(intersection.point.x, intersection.point.y, intersection.point.z);
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
            diameter: 0.2,
            segments: 16
        }, scene);

        sphere.position = position;
        sphere.material = new BABYLON.StandardMaterial("mat", scene);
        sphere.material.diffuseColor = BABYLON.Color3.Red()

        if(sphere) {
            camera.setTarget(sphere.position)
            camera.radius = 20;
        } 

    } catch (error) {
        alert('Error checking intersection: ' + error.message);
    }
}

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


    // Включаем все поля ввода
    enableAllInputs();
};

// Функция для очистки полей ввода
function clearInputFields() {
    // Очищаем поля ввода для отрезка
    document.getElementById('line_x1').value = '';
    document.getElementById('line_y1').value = '';
    document.getElementById('line_z1').value = '';
    document.getElementById('line_x2').value = '';
    document.getElementById('line_y2').value = '';
    document.getElementById('line_z2').value = '';
    
    // Очищаем поля ввода для треугольника
    document.getElementById('plane_x1').value = '';
    document.getElementById('plane_y1').value = '';
    document.getElementById('plane_z1').value = '';
    document.getElementById('plane_x2').value = '';
    document.getElementById('plane_y2').value = '';
    document.getElementById('plane_z2').value = '';
    document.getElementById('plane_x3').value = '';
    document.getElementById('plane_y3').value = '';
    document.getElementById('plane_z3').value = '';
}

// Добавляем обработчики событий
document.getElementById('clearButton').addEventListener('click', clearScene);
document.getElementById('clearInputsButton').addEventListener('click', clearInputFields);

// Запускаем рендер
engine.runRenderLoop(function () {
    scene.render();
});

// Обработка изменения размера окна
window.addEventListener("resize", function () {
    engine.resize();
});