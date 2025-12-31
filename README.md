# OpenCUA Website

This repository contains the source for the OpenCUA website, including the landing page, interactive trajectory viewer, and supporting assets.

## Getting Started

Serve the repository root with Python's built-in HTTP server and open `http://localhost:8000` in your browser:

```
python3 -m http.server 8000
```

If you edit any task data under `static/trajs/<task_id>/`, regenerate the aggregated trajectory file before reloading the page:

```
python3 convert_task.py
```

## File Structure

```
.
├── index.html               # Landing page layout and analytics tags
├── static/
│   ├── css/                 # Site-specific Bulma overrides and custom styles
│   ├── js/
│   │   └── index.js         # UI interactions and trajectory streaming logic
│   ├── images/              # Optimized screenshots, diagrams, and icons
│   ├── videos/              # MP4 hero loops or demos (if any)
│   └── trajs/
│       ├── <task_id>/       # Individual task config.json + traj.jsonl bundles
│       └── trajectory.jsonl # Auto-generated aggregate (run convert_task.py)
├── convert_task.py          # Utility to combine per-task trajectories
├── LICENSE                  # Creative Commons BY-SA 4.0
└── README.md                # This guide
```

## Citation

If you use OpenCUA in your research, please cite our work:

```bibtex
@article{wang2025opencuaopenfoundationscomputeruse,
      title={OpenCUA: Open Foundations for Computer-Use Agents}, 
      author={Xinyuan Wang and Bowen Wang and Dunjie Lu and Junlin Yang and Tianbao Xie and Junli Wang and Jiaqi Deng and Xiaole Guo and Yiheng Xu and Chen Henry Wu and Zhennan Shen and Zhuokai Li and Ryan Li and Xiaochuan Li and Junda Chen and Boyuan Zheng and Peihang Li and Fangyu Lei and Ruisheng Cao and Yeqiao Fu and Dongchan Shin and Martin Shin and Jiarui Hu and Yuyan Wang and Jixuan Chen and Yuxiao Ye and Danyang Zhang and Dikang Du and Hao Hu and Huarong Chen and Zaida Zhou and Haotian Yao and Ziwei Chen and Qizheng Gu and Yipu Wang and Heng Wang and Diyi Yang and Victor Zhong and Flood Sung and Y. Charles and Zhilin Yang and Tao Yu},
      year={2025},
      eprint={2508.09123},
      archivePrefix={arXiv},
      primaryClass={cs.AI},
      url={https://arxiv.org/abs/2508.09123}
}
