import { useHead } from "./composables/index.js";
(() => {
  function setMain() {
    const main = document.querySelector("main");
    main.className = "container my-4";
  }

  // function createVideo() {
  //   // const video = document.createElement("video");
  //   const videoData = [];
  //   /**
  //    * @type {MediaRecorder | null}
  //    */
  //   let videoRecorder = null;
  //   // document.body.appendChild(video);
  //   navigator.mediaDevices
  //     .getUserMedia({
  //       audio: true,
  //       video: {
  //         frameRate: {
  //           ideal: 30,
  //           // max: 60,
  //           // min: 30,
  //         },
  //       },
  //     })
  //     .then((stream) => {
  //       // console.log("stream :>> ", stream);
  //       // video.srcObject = stream;
  //       // video.onloadedmetadata = () => {
  //       //   video.play();
  //       // };

  //       videoRecorder = new MediaRecorder(stream);
  //       videoRecorder.ondataavailable = (e) => {
  //         videoData.push(e.data);
  //       };
  //       videoRecorder.onstop = function () {
  //         this.stream.getTracks().forEach((t) => t.stop());
  //         const blob = new Blob(videoData, { type: "video/mp4" });
  //         const url = URL.createObjectURL(blob);
  //         const a = document.createElement("a");
  //         a.href = url;
  //         a.download = "video.mp4";
  //         a.click();
  //         URL.revokeObjectURL(url);
  //       };
  //     })
  //     .catch(console.error);
  //   const btn = document.createElement("button");
  //   btn.textContent = "start";
  //   document.body.appendChild(btn);
  //   btn.addEventListener("click", () => {
  //     if (!videoRecorder) return;
  //     if (videoRecorder.state === "recording") {
  //       videoRecorder.stop();
  //       videoData.length = 0;
  //       btn.textContent = "start";
  //     } else {
  //       btn.textContent = "stop";
  //       videoRecorder.start();
  //     }
  //   });
  // }

  function createFooter() {
    const footer = document.querySelector("footer");
    footer.className = "py-5 bg-dark";
    footer.innerHTML = `
                <div class="container"><p class="m-0 text-center text-white">Copyright &copy; Lin's Blog</p></div>
            `;
  }

  function createNavBar() {
    const navbar = document.querySelector("nav");
    const root = navbar.dataset.root || "./";
    const getHref = (path = "") => `${root}${path}`;
    navbar.className = "navbar navbar-expand-lg navbar-dark bg-dark";
    navbar.innerHTML = `
    <div class="container">
    <a class="navbar-brand" href="${getHref("index.html")}">Lin's Blog</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link" data-id="index" href="${getHref(
          "index.html"
        )}">首頁</a></li>
        <li class="nav-item"><a class="nav-link" data-id="tags" href="${getHref(
          "tags/index.html"
        )}">標籤</a></li>
        <li class="nav-item"><a class="nav-link" data-id="categories" href="${getHref(
          "categories/index.html"
        )}">分類</a></li>
        <li class="nav-item"><a class="nav-link" data-id="articles" href="${getHref(
          "articles/index.html"
        )}">文章</a></li>
        <li class="nav-item"><a class="nav-link" data-id="dynamic_html_design" href="${getHref(
          "dynamic_html_design/index.html"
        )}">動態網頁設計</a></li>
      </ul>
    </div>
  </div>
            `;

    findNavBarActive();
  }

  function findNavBarActive() {
    const navbar = document.querySelector("nav");
    const activeNavName = navbar.dataset.active || "index";
    const links = navbar.querySelectorAll("a");
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (link.dataset.id === activeNavName) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
        break;
      }
    }
  }

  function setHead() {
    const dom = document.querySelector("use-head");
    if (!dom) return;
    const { title } = dom.dataset;
    useHead({ title });
  }

  function createBreadCrumbs() {
    const nav = document.querySelector("nav");
    const breadcrumbs = nav.dataset.breadcrumbs;
    if (!breadcrumbs) return;
    const rootDom = document.createElement("div");
    rootDom.id = "breadcrumbs";
    rootDom.className = "container mt-3";
    rootDom.setAttribute("aria-label", "breadcrumb");

    rootDom.innerHTML = `
       <ol class="breadcrumb">
         <li class="breadcrumb-item"><a href="#">Home</a></li>
         ${JSON.parse(breadcrumbs)
           .map(
             (crumb) =>
               `<li class="breadcrumb-item"><a href="${crumb.href}">${crumb.title}</a></li>`
           )
           .join("")}
       </ol>
       `;

    document.body.insertBefore(rootDom, nav.nextSibling);
  }

  setMain();
  createFooter();
  createNavBar();
  setHead();
  // createBreadCrumbs();
})();
