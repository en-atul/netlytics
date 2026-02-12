import "./style.css";

const Prism = (window as Window & { Prism?: { highlightAll: () => void } }).Prism;
if (Prism) Prism.highlightAll();
