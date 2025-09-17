import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.js";

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setError(result.error.message || "ログインに失敗しました");
      }
    } catch (err) {
      setError("ログイン処理でエラーが発生しました");
    }

    setLoading(false);
  };

  return (
    <view style={{ maxWidth: "400px", margin: "0 20", padding: "2rem" }}>
      <text
        className="Title"
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        ログイン
      </text>
      <view style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <view>
          <text style={{ marginBottom: "0.5rem" }}>メールアドレス</text>
          <input
            type="email"
            value={email}
            bindinput={(e) => setEmail(e.detail.value)}
            placeholder="メールアドレスを入力してください"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              backgroundColor: "white",
            }}
          />
        </view>

        <view>
          <text style={{ marginBottom: "0.5rem" }}>パスワード</text>
          <input
            type="password"
            value={password}
            bindinput={(e) => setPassword(e.detail.value)}
            placeholder="パスワードを入力してください"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              backgroundColor: "white",
            }}
          />
        </view>
        {error && (
          <view
            style={{
              color: "red",
              fontSize: "0.875rem",
              padding: "0.5rem",
              backgroundColor: "#ffebee",
              borderRadius: "4px",
              maxHeight: "100px",
              overflow: "scroll",
            }}
          >
            <text style={{ color: "red", fontSize: "0.75rem" }}>エラー:</text>
            <text style={{ color: "red", fontSize: "0.7rem" }}>
              {typeof error === "string"
                ? error.substring(0, 150) + "..."
                : JSON.stringify(error).substring(0, 150) + "..."}
            </text>
          </view>
        )}
        <view
          bindtap={loading ? undefined : handleSubmit}
          style={{
            padding: "0.75rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            textAlign: "center",
            position: "relative",
            zIndex: 999,
          }}
        >
          <text style={{ color: "white", pointerEvents: "none" }}>
            {loading ? "ログイン中..." : "ログイン"}
          </text>
        </view>
        <view style={{ textAlign: "center" }}>
          <text>アカウントをお持ちでない方は </text>
          <text
            bindtap={onToggleMode}
            style={{
              color: "#007bff",
              textDecoration: "underline",
              cursor: "pointer",
              position: "relative",
              zIndex: 999,
              pointerEvents: "auto",
            }}
          >
            サインアップ
          </text>
        </view>
      </view>
    </view>
  );
};
