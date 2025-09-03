import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.js";

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleFieldEdit = (field: string) => {
    setEditingField(field);
    setInputValue(
      field === "email" ? email : field === "password" ? password : ""
    );
  };

  const handleSaveField = () => {
    if (editingField === "email") setEmail(inputValue);
    else if (editingField === "password") setPassword(inputValue);

    setEditingField(null);
    setInputValue("");
  };

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
    <view style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <text
        className="Title"
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        ログイン
      </text>
      <view style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <view>
          <text style={{ marginBottom: "0.5rem" }}>メールアドレス</text>
          {editingField === "email" ? (
            <view
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <text
                style={{
                  padding: "0.5rem",
                  border: "1px solid #007bff",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                }}
              >
                {inputValue}
              </text>
              <view style={{ display: "flex", gap: "0.5rem" }}>
                <view
                  bindtap={handleSaveField}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#28a745",
                    color: "",
                    borderRadius: "4px",
                    flex: 1,
                    textAlign: "center",
                    position: "relative",
                    zIndex: 999,
                  }}
                >
                  <text style={{ color: "white", pointerEvents: "none" }}>
                    保存
                  </text>
                </view>
                <view
                  bindtap={() => setEditingField(null)}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#6c757d",
                    color: "white",
                    borderRadius: "4px",
                    flex: 1,
                    textAlign: "center",
                    position: "relative",
                    zIndex: 999,
                  }}
                >
                  <text style={{ color: "white", pointerEvents: "none" }}>
                    キャンセル
                  </text>
                </view>
              </view>
              <view
                style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}
              >
                {[
                  "a",
                  "b",
                  "c",
                  "d",
                  "e",
                  "f",
                  "g",
                  "h",
                  "i",
                  "j",
                  "k",
                  "l",
                  "m",
                  "n",
                  "o",
                  "p",
                  "q",
                  "r",
                  "s",
                  "t",
                  "u",
                  "v",
                  "w",
                  "x",
                  "y",
                  "z",
                  "@",
                  ".",
                  "-",
                  "_",
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                ].map((char) => (
                  <view
                    key={char}
                    bindtap={() => setInputValue((prev) => prev + char)}
                    style={{
                      padding: "0.3rem",
                      backgroundColor: "#e9ecef",
                      borderRadius: "3px",
                      minWidth: "25px",
                      textAlign: "center",
                      position: "relative",
                      zIndex: 999,
                    }}
                  >
                    <text style={{ fontSize: "0.8rem", pointerEvents: "none" }}>
                      {char}
                    </text>
                  </view>
                ))}
                <view
                  bindtap={() => setInputValue((prev) => prev.slice(0, -1))}
                  style={{
                    padding: "0.3rem",
                    backgroundColor: "#dc3545",
                    color: "white",
                    borderRadius: "3px",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 999,
                  }}
                >
                  <text
                    style={{
                      color: "white",
                      fontSize: "0.8rem",
                      pointerEvents: "none",
                    }}
                  >
                    削除
                  </text>
                </view>
              </view>
            </view>
          ) : (
            <view>
              <text
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                {email || "メールアドレスを入力してください"}
              </text>
              <view
                bindtap={() => handleFieldEdit("email")}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "4px",
                  textAlign: "center",
                  position: "relative",
                  zIndex: 999,
                }}
              >
                <text style={{ color: "white", pointerEvents: "none" }}>
                  編集
                </text>
              </view>
            </view>
          )}
        </view>

        <view>
          <text style={{ marginBottom: "0.5rem" }}>パスワード</text>
          {editingField === "password" ? (
            <view
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <text
                style={{
                  padding: "0.5rem",
                  border: "1px solid #007bff",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                }}
              >
                {"*".repeat(inputValue.length)}
              </text>
              <view style={{ display: "flex", gap: "0.5rem" }}>
                <view
                  bindtap={handleSaveField}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#28a745",
                    color: "white",
                    borderRadius: "4px",
                    flex: 1,
                    textAlign: "center",
                    position: "relative",
                    zIndex: 999,
                  }}
                >
                  <text style={{ color: "white", pointerEvents: "none" }}>
                    保存
                  </text>
                </view>
                <view
                  bindtap={() => setEditingField(null)}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#6c757d",
                    color: "white",
                    borderRadius: "4px",
                    flex: 1,
                    textAlign: "center",
                    position: "relative",
                    zIndex: 999,
                  }}
                >
                  <text style={{ color: "white", pointerEvents: "none" }}>
                    キャンセル
                  </text>
                </view>
              </view>
              <view
                style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}
              >
                {[
                  "a",
                  "b",
                  "c",
                  "d",
                  "e",
                  "f",
                  "g",
                  "h",
                  "i",
                  "j",
                  "k",
                  "l",
                  "m",
                  "n",
                  "o",
                  "p",
                  "q",
                  "r",
                  "s",
                  "t",
                  "u",
                  "v",
                  "w",
                  "x",
                  "y",
                  "z",
                  "A",
                  "B",
                  "C",
                  "D",
                  "E",
                  "F",
                  "G",
                  "H",
                  "I",
                  "J",
                  "K",
                  "L",
                  "M",
                  "N",
                  "O",
                  "P",
                  "Q",
                  "R",
                  "S",
                  "T",
                  "U",
                  "V",
                  "W",
                  "X",
                  "Y",
                  "Z",
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "!",
                  "@",
                  "#",
                  "$",
                  "%",
                ].map((char) => (
                  <view
                    key={char}
                    bindtap={() => setInputValue((prev) => prev + char)}
                    style={{
                      padding: "0.3rem",
                      backgroundColor: "#e9ecef",
                      borderRadius: "3px",
                      minWidth: "25px",
                      textAlign: "center",
                      position: "relative",
                      zIndex: 999,
                    }}
                  >
                    <text style={{ fontSize: "0.8rem", pointerEvents: "none" }}>
                      {char}
                    </text>
                  </view>
                ))}
                <view
                  bindtap={() => setInputValue((prev) => prev.slice(0, -1))}
                  style={{
                    padding: "0.3rem",
                    backgroundColor: "#dc3545",
                    color: "white",
                    borderRadius: "3px",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 999,
                  }}
                >
                  <text
                    style={{
                      color: "white",
                      fontSize: "0.8rem",
                      pointerEvents: "none",
                    }}
                  >
                    削除
                  </text>
                </view>
              </view>
            </view>
          ) : (
            <view>
              <text
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                {password
                  ? "*".repeat(password.length)
                  : "パスワードを入力してください"}
              </text>
              <view
                bindtap={() => handleFieldEdit("password")}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "4px",
                  textAlign: "center",
                  position: "relative",
                  zIndex: 999,
                }}
              >
                <text style={{ color: "white", pointerEvents: "none" }}>
                  編集
                </text>
              </view>
            </view>
          )}
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
