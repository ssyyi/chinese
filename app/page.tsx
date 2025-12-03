"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, RotateCcw, BookOpen, Clock } from "lucide-react";

// 动态导入 HanziWriter 组件以避免 SSR 问题
const HanziWriterComponent = dynamic(() => import("@/components/HanziWriter"), {
  ssr: false,
  loading: () => (
    <div className="w-[280px] h-[280px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 animate-pulse">
      <span className="text-gray-500">加载中...</span>
    </div>
  ),
});

// 初始汉字列表
const INITIAL_CHARACTERS = [
  "一",
  "二",
  "三",
  "人",
  "大",
  "天",
  "日",
  "月",
  "水",
  "火",
  "木",
  "土",
  "山",
  "石",
  "田",
  "力",
  "手",
  "足",
  "目",
  "口",
  "心",
  "门",
  "们",
  "你",
  "好",
  "爱",
  "学",
  "书",
  "中",
  "国",
  "文",
  "字",
  "风",
  "雨",
  "雷",
  "电",
  "春",
  "夏",
  "秋",
  "冬",
];

export default function Home() {
  // 改为数组状态以支持多字
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [displayCharacters, setDisplayCharacters] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [inputError, setInputError] = useState("");

  // 初始化：随机打乱列表并选择一个随机字
  useEffect(() => {
    const shuffled = [...INITIAL_CHARACTERS].sort(() => Math.random() - 0.5);
    setDisplayCharacters(shuffled);
    const randomChar = shuffled[Math.floor(Math.random() * shuffled.length)];
    setSelectedChars([randomChar]);
  }, []);

  const handleCharacterClick = useCallback((char: string) => {
    setSelectedChars([char]);
    setIsCustom(false);
  }, []);

  const handleReset = useCallback(() => {
    const randomChar =
      INITIAL_CHARACTERS[Math.floor(Math.random() * INITIAL_CHARACTERS.length)];
    setSelectedChars([randomChar]);
    setSearchQuery("");
    setIsCustom(false);
    setInputError(""); // Clear error on reset
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = searchQuery.trim();

      // 验证输入:仅支持1-4个汉字
      const chineseRegex = /^[\u4e00-\u9fa5]{1,4}$/;

      if (!trimmed) {
        setInputError("请输入汉字");
        return;
      }

      if (!chineseRegex.test(trimmed)) {
        if (!/^[\u4e00-\u9fa5]+$/.test(trimmed)) {
          setInputError("仅支持输入汉字");
        } else {
          setInputError("仅支持1-4个汉字");
        }
        return;
      }

      // 清除错误
      setInputError("");

      // 将输入字符串拆分为字符数组
      const chars = trimmed.split("");
      setSelectedChars(chars);
      setIsCustom(true);

      // 添加到搜索历史(去重,最多保留8条)
      setSearchHistory((prev) => {
        const newHistory = [
          trimmed,
          ...prev.filter((item) => item !== trimmed),
        ];
        return newHistory.slice(0, 8);
      });

      setSearchQuery("");
    },
    [searchQuery]
  );

  const handleHistoryClick = useCallback((historyItem: string) => {
    const chars = historyItem.split("");
    setSelectedChars(chars);
    setIsCustom(true);
    setInputError(""); // Clear error when selecting from history
  }, []);

  return (
    <main className="min-h-screen w-full flex flex-col items-center relative overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* 动态背景 */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* 主容器 - 居中显示 */}
      <div className="w-full max-w-7xl mx-auto py-8 md:py-16 px-8 sm:px-10">
        {/* 头部区域 */}
        <header className="text-center !mb-6 !mt-2">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text">
            汉字书写练习
          </h1>
          <p className="text-gray-400 text-base md:text-lg mb-8">
            Interactive Chinese Character Writing Practice
          </p>
          <Separator className="bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
        </header>
        {/* 搜索区域 - 使用 Card */}
        <div className="flex justify-center !mb-8 !mx-2 ">
          <Card className="w-full border-none bg-white/5 backdrop-blur-xl shadow-2xl shadow-teal-500/10 ">
            {/* <Card className="w-full border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-teal-500/10 "> */}
            <CardContent className="p-10">
              <form
                onSubmit={handleSearch}
                className="flex items-between flex-col sm:flex-row gap-2 "
              >
                <div className="relative flex-2">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setInputError("");
                    }}
                    placeholder="请输入1-4个汉字"
                    className="text-center !text-2xl h-15 px-8 bg-white/5 border-white/20 focus-visible:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30 placeholder:text-gray-500 text-white transition-all"
                    maxLength={4}
                  />
                </div>
                <div className="flex flex-1 gap-5 justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 min-w-30 sm:flex-none h-15 px-12 py-5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-lg shadow-teal-500/30 transition-all hover:shadow-teal-500/50 hover:scale-105 font-semibold text-lg"
                  >
                    <Search className="w-6 h-6 !mr-2" />
                    搜索
                  </Button>
                  <Button
                    type="button"
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="flex-1 min-w-30 sm:flex-none h-15 px-12 py-5 border-white/20 bg-white/5 hover:bg-white/10 hover:text-white transition-all hover:scale-105 font-semibold text-lg"
                  >
                    <RotateCcw className="w-6 h-6 !mr-2" />
                    重置
                  </Button>
                </div>
              </form>
              {inputError && (
                <div className="!mt-2 text-center">
                  <Badge
                    variant="destructive"
                    className="text-base !py-2 !px-4"
                  >
                    {inputError}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* 主要内容区 - 汉字书写 */}
        <div className="flex justify-center !mx-1">
          <Card className="w-full border-2 border-teal-500/30 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl shadow-2xl shadow-teal-500/20">
            <CardContent className="p-12 md:p-20">
              <div className="flex justify-center items-center">
                {selectedChars.length === 1 ? (
                  // 单字居中显示
                  <div className="flex flex-col items-center space-y-10">
                    {/* 当前汉字展示 */}
                    <div className="relative">
                      <div className="text-7xl md:text-8xl font-bold gradient-text select-none !my-4">
                        {selectedChars[0]}
                      </div>
                      {isCustom && (
                        <Badge className="absolute -top-3 -right-16 bg-teal-500/30 text-teal-200 border-teal-500/50 hover:bg-teal-500/40 px-4 py-2 text-sm">
                          自定义
                        </Badge>
                      )}
                    </div>
                    {/* 书写组件 - 单字使用较大尺寸 */}
                    <div className="relative !mb-4">
                      <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
                      <div className="relative">
                        <HanziWriterComponent
                          character={selectedChars[0]}
                          size={280}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // 多字 flex 布局，自动居中
                  <div className="flex flex-wrap justify-center gap-6 md:gap-16">
                    {selectedChars.map((char, index) => (
                      <div
                        key={`${char}-${index}`}
                        className="flex flex-col items-center space-y-8"
                      >
                        {/* 当前汉字展示 */}
                        <div className="relative">
                          <div className="text-5xl md:text-6xl font-bold gradient-text select-none !my-6">
                            {char}
                          </div>
                          {isCustom && index === selectedChars.length - 1 && (
                            <Badge className="absolute -top-2 -right-14 bg-teal-500/30 text-teal-200 border-teal-500/50 hover:bg-teal-500/40 text-xs !px-3 !py-1.5">
                              自定义
                            </Badge>
                          )}
                        </div>
                        {/* 书写组件 */}
                        <div className="relative !mb-4">
                          <div className="absolute -inset-3 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-lg" />
                          <div className="relative">
                            <HanziWriterComponent character={char} size={200} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* 底部区域 - 常用汉字和搜索历史 */}
        <div className="space-y-10 !mt-5 !mx-2">
          {/* 常用汉字列表 */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
            <CardHeader className="!py-2 !px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-3 text-gray-100">
                  <BookOpen className="w-6 h-6 text-teal-400" />
                  常用汉字
                </CardTitle>
                <Badge
                  variant="outline"
                  className="text-sm border-white/20 text-gray-400 !px-4 !py-2"
                >
                  左右滑动
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="!px-5 !mb-2">
              <div
                className="overflow-x-auto scrollbar-hide !py-2"
                style={{ scrollbarWidth: "none" }}
              >
                <div className="flex gap-5 min-w-max">
                  {displayCharacters.map((char) => (
                    <Button
                      key={char}
                      onClick={() => handleCharacterClick(char)}
                      variant={
                        selectedChars.includes(char) && !isCustom
                          ? "default"
                          : "outline"
                      }
                      size="lg"
                      className={`
                        w-18 h-18 md:w-24 md:h-24 rounded-xl font-bold text-3xl md:text-4xl 
                        transition-all duration-300
                        ${
                          selectedChars.includes(char) && !isCustom
                            ? "bg-gradient-to-br from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-lg shadow-teal-500/40 scale-105 border-0"
                            : "bg-white/5 hover:bg-white/10 text-gray-300 border-white/20 hover:scale-110 hover:border-teal-500/50"
                        }
                      `}
                    >
                      {char}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 搜索历史 */}
          {searchHistory.length > 0 && (
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-xl !mt-5 !mb-2">
              <CardHeader className="!py-2 !px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-3 text-gray-100">
                    <Clock className="w-6 h-6 text-cyan-400" />
                    搜索历史
                  </CardTitle>
                  <Button
                    onClick={() => setSearchHistory([])}
                    variant="ghost"
                    size="sm"
                    className="text-base text-gray-500 hover:text-gray-300 hover:bg-white/10 !px-6 !py-3"
                  >
                    清空
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="!px-5 !pb-2">
                <div className="flex flex-wrap gap-5">
                  {searchHistory.map((item, index) => (
                    <Button
                      key={index}
                      onClick={() => handleHistoryClick(item)}
                      variant="outline"
                      size="lg"
                      className="bg-white/5 hover:bg-gradient-to-br hover:from-teal-600/30 hover:to-cyan-600/30 text-gray-300 hover:text-white border-white/20 hover:border-teal-500/50 transition-all hover:scale-105 text-xl !px-10 !py-4 font-semibold"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
