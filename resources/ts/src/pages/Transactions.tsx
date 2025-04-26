import { NewTransactionModal } from "../components/NewTransactionModal";
import { useState } from "react";
import { NavigationModal } from "../components/NavigationModal";
import { TransactionList } from "../components/TransactionList";

export default function Transactions() {

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <span className="text-xl font-semibold">
                            Transactions
                        </span>
                        <NavigationModal />
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-6">
                    {/* <div className="flex justify-end"> */}
                    <div className="fixed bottom-6 right-6 z-50">
                        <NewTransactionModal />
                    </div>
                    <TransactionList />
                </div>
            </main>
        </div>
    );
}
