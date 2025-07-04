import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入动画库
import gsap from "gsap";

// 导入dat.gui
import * as dat from "dat.gui";
// 目标 控制3d物体的缩放
// 创建场景
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

// 添加物体
// 创建几何体a
const cubeGeometry = new THREE.BoxGeometry();
// position 顶点位置  一个面4个点 6个面24个点 x,y,z三个坐标就是72个值
// uv 实际也是xy轴 加上材质纹理
// normal 法相 光打过来面的朝向
console.log(cubeGeometry);
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
});
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
console.log(cube);
// 修改物体的位置
// cube.position.set(5, 0, 0);
// cube.position.x = 3;
// 缩放
// cube.scale.set(3, 2, 1);
// cube.scale.x = 5;
// 旋转
cube.rotation.set(Math.PI / 4, 0, 0, "XZY");
const gui = new dat.GUI();
gui
  .add(cube.position, "x")
  .min(0)
  .max(5)
  .step(0.01)
  .name("移动x轴")
  .onChange(() => {
    console.log("值被修改");
  })
  .onFinishChange(() => {
    console.log("完全停下来");
  });
// 修改物体的颜色
const params = {
  color: "#ffff00",
  fn: () => {
    // 让立方体运动起来
    gsap.to(cube.position, { x: 5, duration: 2, yoyo: true, repeat: -1 });
  },
};
gui.addColor(params, "color").onChange((value) => {
  console.log("值被修改", value);
  cube.material.color.set(value);
});
gui.add(cube, "visible").name("是否显示");
// 设置按钮点击触发某个事件
gui.add(params, "fn").name("立方体运动");
const folder = gui.addFolder("设置立方体");
folder.add(cube.material, "wireframe");
// 将几何体添加到创建中
scene.add(cube);
// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

//使用渲染器通过相机将场景渲染出来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼 让控制器更有真实效果
controls.enableDamping = true;
// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置动画
// var animate1 = gsap.to(cube.position, {
//   x: 5,
//   duration: 5,
//   ease: "power1.inOut",
//   onComplete: () => {
//     console.log("动画完成");
//   },
//   onStart: () => {
//     console.log("动画开始");
//   },
//   // 重复次数 无限次循环-1
//   repeat: -1,
//   // 往返运动
//   yoyo: true,
//   delay: 2,
// });
// gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, ease: "power1.inOut" });
function render(time) {
  controls.update();
  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}
window.addEventListener("dblclick", () => {
  // 双击控制屏幕切换全屏
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
render();
// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  // console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
