"use client";

import { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";

interface HanziWriterComponentProps {
  character: string;
  size?: number;
}

export default function HanziWriterComponent({
  character,
  size = 280,
}: HanziWriterComponentProps) {
  const writerRef = useRef<HTMLDivElement>(null);
  const writerInstanceRef = useRef<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [currentSize, setCurrentSize] = useState(size);

  // 响应式尺寸调整
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCurrentSize(Math.min(size, window.innerWidth - 80));
      } else {
        setCurrentSize(size);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [size]);

  useEffect(() => {
    if (!writerRef.current || !character) return;

    if (writerInstanceRef.current) {
      writerInstanceRef.current.cancelQuiz();
    }
    writerRef.current.innerHTML = "";

    try {
      const writer = HanziWriter.create(writerRef.current, character, {
        width: currentSize,
        height: currentSize,
        padding: 20,
        strokeColor: "#14b8a6", // Teal-500
        radicalColor: "#06b6d4", // Cyan-500
        outlineColor: "#f87171", // Red-400 (Miao Hong)
        showCharacter: false, // 默认隐藏填充，只显示轮廓供描红
        showOutline: true,
        highlightOnComplete: true, // 完成后高亮
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 120,
        delayBetweenLoops: 2000,
        drawingColor: "#5eead4", // Teal-300
        drawingWidth: 20, // 加粗笔画，让书写体验更好
        showHintAfterMisses: 1, // 写错1次就提示
      });

      writerInstanceRef.current = writer;

      // 获取笔画数
      writer.setCharacter(character).then(() => {
        const charData = (writer as any)._character;
        if (charData && charData.strokes) {
          setStrokeCount(charData.strokes.length);
        }
        // 加载完成后直接开启描红模式
        writer.hideCharacter();
        writer.showOutline();
        startQuiz(writer);
      });
    } catch (error) {
      console.error("Error creating HanziWriter:", error);
    }

    return () => {
      if (writerInstanceRef.current) {
        writerInstanceRef.current.cancelQuiz();
      }
    };
  }, [character, currentSize]);

  const startQuiz = (writer: any) => {
    writer.quiz({
      onComplete: () => {
        // 完成后保持高亮状态，不进行重置
        // 可以在这里添加完成动画或音效
        console.log("Character written!");
      },
    });
  };

  const handleAnimate = () => {
    if (writerInstanceRef.current && !isAnimating) {
      setIsAnimating(true);
      // 动画前先取消当前的 quiz
      writerInstanceRef.current.cancelQuiz();
      writerInstanceRef.current.animateCharacter({
        onComplete: () => {
          setIsAnimating(false);
          // 动画结束后重新开启 quiz
          startQuiz(writerInstanceRef.current);
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* 汉字显示区域 */}
      <div className="relative !mb-4 group">
        {/* 装饰性背景光晕 */}
        <div className="absolute inset-0 bg-teal-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div
          ref={writerRef}
          className="relative z-10 bg-white/5 rounded-2xl border border-white/10 shadow-inner"
          style={{
            width: currentSize,
            height: currentSize,
          }}
        />

        {strokeCount > 0 && (
          <div className="absolute -right-2 -bottom-2 bg-surface border border-white/10 !px-2 !py-0.5 rounded-md text-[12px] font-medium text-gray-400 shadow-lg z-20 pointer-events-none">
            {strokeCount}画
          </div>
        )}
      </div>

      {/* 操作按钮组 */}
      <div className="flex gap-2">
        <button
          onClick={handleAnimate}
          disabled={isAnimating}
          className="flex items-center gap-2 !px-4 !py-2 rounded-xl font-medium text-base transition-all duration-300 bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{isAnimating ? "播放中..." : "笔顺演示"}</span>
        </button>

        <button
          onClick={() => {
            if (writerInstanceRef.current) {
              writerInstanceRef.current.cancelQuiz();
              writerInstanceRef.current.hideCharacter();
              writerInstanceRef.current.showOutline();
              startQuiz(writerInstanceRef.current);
            }
          }}
          className="flex items-center gap-2 !px-4 !py-2 rounded-xl font-medium text-base transition-all duration-300 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:-translate-y-0.5"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>重新描红</span>
        </button>
      </div>
    </div>
  );
}
