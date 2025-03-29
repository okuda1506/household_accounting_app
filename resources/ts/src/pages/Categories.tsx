"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// サンプルデータ
const categories = {
    income: [
        { id: 1, name: "給与", description: "定期的な収入", color: "#4CAF50" },
        { id: 2, name: "ボーナス", description: "臨時収入", color: "#8BC34A" },
        { id: 3, name: "投資", description: "配当金や利息", color: "#CDDC39" },
        {
            id: 4,
            name: "副業",
            description: "フリーランス収入",
            color: "#FFC107",
        },
    ],
    expense: [
        { id: 1, name: "食費", description: "食料品や外食", color: "#F44336" },
        {
            id: 2,
            name: "住居費",
            description: "家賃や住宅ローン",
            color: "#E91E63",
        },
        { id: 3, name: "交通費", description: "通勤や旅行", color: "#9C27B0" },
        {
            id: 4,
            name: "光熱費",
            description: "電気・ガス・水道",
            color: "#673AB7",
        },
        {
            id: 5,
            name: "通信費",
            description: "携帯電話やインターネット",
            color: "#3F51B5",
        },
        { id: 6, name: "娯楽費", description: "趣味や娯楽", color: "#2196F3" },
    ],
};

const Categories = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">カテゴリ</h1>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    新規カテゴリ
                </button>
            </div>

            <Card className="bg-gray-800 text-white">
                <CardHeader>
                    <CardTitle>カテゴリ一覧</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tab.Group
                        selectedIndex={selectedTab}
                        onChange={setSelectedTab}
                    >
                        <Tab.List className="flex p-1 space-x-1 bg-gray-700 rounded-xl mb-6">
                            <Tab
                                className={({ selected }) =>
                                    `w-full py-2.5 text-sm font-medium leading-5 rounded-lg
                  ${
                      selected
                          ? "bg-indigo-600 text-white shadow"
                          : "text-gray-400 hover:bg-gray-600 hover:text-white"
                  }`
                                }
                            >
                                収入
                            </Tab>
                            <Tab
                                className={({ selected }) =>
                                    `w-full py-2.5 text-sm font-medium leading-5 rounded-lg
                  ${
                      selected
                          ? "bg-indigo-600 text-white shadow"
                          : "text-gray-400 hover:bg-gray-600 hover:text-white"
                  }`
                                }
                            >
                                支出
                            </Tab>
                        </Tab.List>
                        <Tab.Panels>
                            <Tab.Panel>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {categories.income.map((category) => (
                                        <div
                                            key={category.id}
                                            className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className="w-4 h-4 rounded-full mr-3"
                                                    style={{
                                                        backgroundColor:
                                                            category.color,
                                                    }}
                                                ></div>
                                                <div>
                                                    <h3 className="text-white font-medium">
                                                        {category.name}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm">
                                                        {category.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="text-gray-400 hover:text-white">
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button className="text-gray-400 hover:text-red-500">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {categories.expense.map((category) => (
                                        <div
                                            key={category.id}
                                            className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className="w-4 h-4 rounded-full mr-3"
                                                    style={{
                                                        backgroundColor:
                                                            category.color,
                                                    }}
                                                ></div>
                                                <div>
                                                    <h3 className="text-white font-medium">
                                                        {category.name}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm">
                                                        {category.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="text-gray-400 hover:text-white">
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button className="text-gray-400 hover:text-red-500">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </CardContent>
            </Card>
        </div>
    );
};

export default Categories;
