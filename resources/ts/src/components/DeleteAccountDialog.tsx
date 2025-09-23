"use client";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

type Props = {
    children: React.ReactElement;
};

export function DeleteAccountDialog({ children }: Props) {
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        try {
            await api.delete("/delete-user");
            localStorage.removeItem("access_token");
            toast.success("アカウントを削除しました。");
            navigate("/login", { replace: true });
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "アカウントの削除に失敗しました。";
            toast.error(message);
            console.error("アカウントの削除に失敗しました", error);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900 text-white border-gray-700">
                <AlertDialogHeader>
                    <AlertDialogTitle>本当に退会しますか？</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                        この操作は元に戻せません。アカウントを削除すると、関連するすべてのデータが完全に削除されます。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                        キャンセル
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        退会する
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
