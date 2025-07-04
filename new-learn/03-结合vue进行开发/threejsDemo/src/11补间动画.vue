<script setup>
// 导入threejs
import * as THREE from "three";
// 导入轨道控制器 也就是可以拖动和缩放的能力
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
// 目标补间动画
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
  // 更新tween
  TWEEN.update();
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

const gui = new GUI();
const spherel = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
spherel.position.x = -4;
scene.add(spherel);

const tween = new TWEEN.Tween(spherel.position);
tween.to({ x: 4 }, 1000).onUpdate(() => {
  console.log(spherel.position.x);
});
// 循环 Infinity
// tween.repeat(Infinity);
// tween.yoyo(true);
// 每次允许都会延迟
// tween.delay(3000);
// 设置缓动函数
tween.easing(TWEEN.Easing.Quadratic.InOut);
// 启动补件动画
const tween2 = new TWEEN.Tween(spherel.position);
tween2.to({ y: -4 }, 1000).onUpdate(() => {});
tween.chain(tween2);
tween2.chain(tween);
tween.start();
tween.onStart(() => {
  console.log("动画开始");
});
tween.onComplete(() => {
  console.log("动画结束");
});
tween.onStop(() => {});
tween.onUpdate(() => {});
let params = {
  stop: () => {
    tween.stop();
  },
};
gui.add(params, "stop");
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
