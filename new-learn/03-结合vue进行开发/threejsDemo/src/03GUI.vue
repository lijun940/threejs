<script setup>
// 导入threejs
import * as THREE from "three";
// 导入轨道控制器 也就是可以拖动和缩放的能力
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";

// 创建场景
const scene = new THREE.Scene();

// 创建相机 透视相机 近大远小
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远屏幕
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 创建材质
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
});
const parentMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});
parentMaterial.wireframe = true;
let parentCube = new THREE.Mesh(geometry, parentMaterial);

// 创建网格 也就是物体
const cube = new THREE.Mesh(geometry, material);
parentCube.add(cube);
parentCube.position.set(-3, 0, 0);
parentCube.scale.set(2, 2, 2);
parentCube.rotation.x = Math.PI / 4;
// cube.position.x = 2;
cube.position.set(3, 0, 0);
// 设置立方体的放大
cube.scale.set(2, 2, 2);
cube.rotation.x = Math.PI / 4;
// 将网格添加到场景中
scene.add(parentCube);

// 设置相机位置
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 添加轨道控制器
// 看到拖动和缩放 物体发生视觉上的变化是因为监听了浏览器canvas事件,控制相机绕着
const controls = new OrbitControls(camera, renderer.domElement);
// 如果canvas被挡住了，换一个对象监听 但是小心控制器事件和点击事件互相影响
// const controls = new OrbitControls(camera, document.body);

// 带阻尼
controls.enableDamping = true;
// 阻尼系数
controls.dampingFactor = 0.05;

// 渲染
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
// 监听窗口的变化
window.addEventListener("resize", () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 充值相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机投影矩阵
  camera.updateProjectionMatrix();
});
const fullScreenFn = (bool) => {
  if (bool) {
    document.body.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
let eventObj = {
  Fullscreen: () => {
    document.body.requestFullscreen();
  },
  Exitscreen: () => {
    document.exitFullscreen();
  },
};
const gui = new GUI();
// 添加按钮
gui.add(eventObj, "Fullscreen").name("全屏");
gui.add(eventObj, "Exitscreen").name("退出全屏");
// 控制立方体的位置
// gui.add(cube.position, "x", -5, 5).name("立方体位置");
let folder = gui.addFolder("立方体");
folder
  .add(cube.position, "x")
  .min(-10)
  .max(10)
  .step(1)
  .name("立方体x位置")
  .onChange((val) => {
    console.log("立方体x位置", val);
  })
  .onFinishChange((val) => {
    console.log("finish");
  });
folder.add(cube.position, "y").min(-10).max(10).step(1).name("立方体y位置");
folder.add(cube.position, "z").min(-10).max(10).step(1).name("立方体z位置");

gui.add(parentMaterial, "wireframe").name("父元素线框模式");
let colorParams = {
  cubeColor: "#ff0000",
};
gui
  .addColor(colorParams, "cubeColor")
  .name("立方体颜色")
  .onChange((val) => {
    cube.material.color.set(val);
  });
</script>

<template></template>

<style scoped>
.btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  &.exit {
    left: 100px;
  }
}
</style>
