<script setup>
// 导入threejs
import * as THREE from "three";
// 导入轨道控制器 也就是可以拖动和缩放的能力
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import uvJpg from "./assets/texture/uv_grid_opengl.jpg";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import hdr from "./assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr";
// 导入顶点法向量辅助器
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js";

// 目标uv坐标系
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

const planGeometry = new THREE.PlaneGeometry(2, 2);

const uvTexture = new THREE.TextureLoader().load(uvJpg);
const planeMaterial = new THREE.MeshBasicMaterial({
  map: uvTexture,
});
const planeMesh = new THREE.Mesh(planGeometry, planeMaterial);
console.log(planGeometry);
scene.add(planeMesh);
planeMesh.position.x = -3;
const geometry = new THREE.BufferGeometry();
// const vertices = new Float32Array([
//   -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0,
// ]);
const vertices = new Float32Array([
  3.0, -1.0, 0.0, 5.0, -1.0, 0.0, 5.0, 1.0, 0.0, 3.0, 1.0, 0.0,
]);
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
geometry.setIndex(new THREE.BufferAttribute(indices, 1));
// 设置uv坐标
const uv = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
// 创建uv属性
geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
// 计算出法向向量
// geometry.computeVertexNormals();
// 或者自己设置法向量
const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
const material = new THREE.MeshBasicMaterial({
  map: uvTexture,
  side: THREE.DoubleSide,
});
// 大多数时候是直接修改物体的position 不会对顶点进行位移，但有时候从后端拿到数据 已经比较偏了，移回原点就用translate
geometry.translate(-4, 0, 0);
geometry.rotateX(Math.PI / 2);
geometry.scale(3, 3, 3);

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

plane.position.x = 0;
// 创建法向量辅助器
const helper = new VertexNormalsHelper(plane, 0.2, 0xff0000);
scene.add(helper);
// 添加轨道控制器
// 看到拖动和缩放 物体发生视觉上的变化是因为监听了浏览器canvas事件,控制相机绕着
const controls = new OrbitControls(camera, renderer.domElement);
// 如果canvas被挡住了，换一个对象监听 但是小心控制器事件和点击事件互相影响
// const controls = new OrbitControls(camera, document.body);

// 带阻尼
controls.enableDamping = true;
// 阻尼系数
controls.dampingFactor = 0.05;
let rgbLoader = new RGBELoader();
rgbLoader.load(hdr, (envMap) => {
  // 设置球星贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  // 设置环境贴图
  scene.background = envMap;
  // 场景设置环境贴图
  scene.environment = envMap;
  // 设置plane的环境贴图
  planeMaterial.envMap = envMap;
  material.envMap = envMap;
});
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

const gui = new GUI();
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
