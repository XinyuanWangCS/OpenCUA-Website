#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
聚合 static/trajs 下所有任务，将 config.json 中的 instruction
和 traj.jsonl 中的步骤解析为统一格式，写入 trajectory.jsonl。
"""
import os
import json
import re
from pathlib import Path
from typing import Tuple, Dict, Optional, List

ROOT_DIR = Path(
    "/home/wangxinyuan/workspace/AGN-OpenSource/opencua-website/static/trajs"
)
OUT_FILE = ROOT_DIR / "trajectory.jsonl"


# ---------- 解析 response（thought / action / code） ----------
ACTION_RE = re.compile(r"##\s*Action:\s*\n([^#`]+)", re.DOTALL)
THOUGHT_RE = re.compile(r"##\s*Thought:\s*\n([^#`]+)", re.DOTALL)  # 如无则为空
CODE_RE = re.compile(r"```(?:python|code)?\s*([^`]+?)```", re.DOTALL)


def extract_sections(resp: str) -> Tuple[str, str, str]:
    """从 response 中提取 thought / action / code。"""
    thought = THOUGHT_RE.search(resp)
    action = ACTION_RE.search(resp)
    code = CODE_RE.search(resp)

    return (
        (thought.group(1).strip() if thought else ""),
        (action.group(1).strip() if action else ""),
        (code.group(1).strip() if code else ""),
    )


# ---------- 从 code 里抽取鼠标/键盘动作 ----------
COORD_PAIR = re.compile(r"([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)")
NAMED_COORD = re.compile(r"x\s*=\s*([-+]?\d*\.?\d+)\s*,\s*y\s*=\s*([-+]?\d*\.?\d+)")


def _parse_coords(arg_str: str) -> Tuple[float, float]:
    """解析坐标 (x, y)，既支持 (123, 456) 也支持 x=0.12, y=0.34。"""
    m = NAMED_COORD.search(arg_str) or COORD_PAIR.search(arg_str)
    if not m:
        return None, None
    return int(1920*float(m.group(1))), int(1080*float(m.group(2)))


def build_actions(code: str) -> Tuple[Optional[Dict], Optional[Dict]]:
    """
    根据 code 返回 mouseAction / keyboardAction
    （若无对应动作则返回 None）。
    """
    mouse_action: Optional[Dict] = None
    keyboard_action: Optional[Dict] = None

    lines = [ln.strip() for ln in code.splitlines() if ln.strip()]
    start_coords = None  # 用于 drag

    for line in lines:
        if m := re.match(r"pyautogui\.(click|rightClick|doubleClick)\(([^)]*)\)", line):
            func, args = m.groups()
            x, y = _parse_coords(args)
            mouse_action = {"type": func, "x": x, "y": y}

        elif m := re.match(r"pyautogui\.scroll\(([^)]*)\)", line):
            args = m.group(1)
            parts = [p.strip() for p in args.split(",")]
            clicks = int(parts[0])
            x, y = _parse_coords(args)
            mouse_action = {"type": "scroll", "x": x, "y": y, "clicks": clicks}

        elif m := re.match(r"pyautogui\.(moveTo|click)\(([^)]*)\)", line):
            # 拖拽的起点
            start_coords = _parse_coords(m.group(2))

        elif m := re.match(r"pyautogui\.dragTo\(([^)]*)\)", line):
            end_coords = _parse_coords(m.group(1))
            if start_coords and end_coords:
                mouse_action = {
                    "type": "drag",
                    "startX": start_coords[0],
                    "startY": start_coords[1],
                    "endX": end_coords[0],
                    "endY": end_coords[1],
                }

        elif m := re.match(r"pyautogui\.(write|typewrite)\(([^)]*)\)", line):
            args = m.group(2)
            txt = re.search(r"(?:message=)?['\"](.+?)['\"]", args).group(1)
            keyboard_action = {"type": "type", "text": txt}

        elif m := re.match(r"pyautogui\.press\(([^)]*)\)", line):
            key = re.search(r"['\"](.+?)['\"]", m.group(1)).group(1)
            keyboard_action = {"type": "press", "key": key}

    return mouse_action, keyboard_action


# ---------- 主流程 ----------
def process_task(task_dir: Path) -> Dict:
    """把单个任务目录转换成目标 dict。"""
    task_id = task_dir.name

    # 读取 config.json 里的指令
    cfg_path = task_dir / "config.json"
    instruction = ""
    if cfg_path.exists():
        with open(cfg_path, encoding="utf-8") as f:
            cfg = json.load(f)
        instruction = cfg.get("instruction") or cfg.get("prompt", "").strip()

    # 解析 traj.jsonl
    traj_path = task_dir / "traj.jsonl"
    steps: List[Dict] = []

    with open(traj_path, encoding="utf-8") as f:
        for line in f:
            row = json.loads(line)
            step_num = row["step_num"]
            thought, action_desc, code_block = extract_sections(row["response"])
            mouse_act, key_act = build_actions(code_block)
            
            if "computer.terminate" in code_block:
                action_desc = "DONE"

            step = {
                "stepNum": step_num,
                "thought": thought,
                "action": action_desc,
                "code": code_block,
                "response": row["response"].strip(),
                "image": f"./static/trajs/{task_id}/{row['screenshot_file']}",
            }
            if mouse_act:
                step["mouseAction"] = mouse_act
            if key_act:
                step["keyboardAction"] = key_act

            steps.append(step)

    return {"id": task_id, "steps": steps, "instruction": instruction}


def main():
    tasks = []
    for item in ROOT_DIR.iterdir():
        if not item.is_dir():
            continue
        if not (item / "traj.jsonl").exists():
            continue  # 跳过无数据的目录

        tasks.append(process_task(item))

    # 写入 trajectory.jsonl
    with open(OUT_FILE, "w", encoding="utf-8") as fout:
        for task in tasks:
            fout.write(json.dumps(task, ensure_ascii=False) + "\n")

    print(f"✅ 处理完成，输出 {OUT_FILE}")


if __name__ == "__main__":
    main()
