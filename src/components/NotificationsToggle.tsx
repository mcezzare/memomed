"use client";

import { useState } from "react";
import { subscribePush } from "@/utils/push";

export default function NotificationsToggle() {
  const [enabled, setEnabled] = useState(false);

  const handleEnable = async () => {
    try {
      await subscribePush();
      setEnabled(true);
      alert("Notificações ativadas com sucesso!");
    } catch (err) {
      console.error("Erro ao ativar notificações:", err);
      alert("Falha ao ativar notificações.");
    }
  };

  return (
    <button
      onClick={handleEnable}
      disabled={enabled}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        backgroundColor: enabled ? "gray" : "blue",
        color: "white",
      }}
    >
      {enabled ? "Notificações ativadas" : "Ativar notificações"}
    </button>
  );
}
