import { getMessages } from "@/lib/db";
import { toggleMessageRead, removeMessage } from "@/lib/actions";
import { btnPrimary, btnSecondary, card } from "@/lib/ui";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          {messages.length} message{messages.length > 1 ? "s" : ""} reçu{messages.length > 1 ? "s" : ""} via le
          formulaire de contact.
        </p>
      </div>

      {messages.length === 0 && (
        <p className="text-sm text-gray-500">Aucun message pour le moment.</p>
      )}

      {messages.map((message) => (
        <div key={message.id} className={card}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="font-semibold text-white">
                {message.name}
                {!message.is_read && (
                  <span className="ml-2 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-full px-2 py-0.5">
                    non lu
                  </span>
                )}
              </p>
              <a href={`mailto:${message.email}`} className="text-sm text-gray-500 hover:text-blue-400">
                {message.email}
              </a>
            </div>
            <span className="text-xs text-gray-600">
              {new Date(message.created_at).toLocaleString("fr-FR")}
            </span>
          </div>

          <p className="text-sm text-gray-300 whitespace-pre-wrap border-l-2 border-gray-800 pl-4">
            {message.message}
          </p>

          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-800">
            <form action={toggleMessageRead}>
              <input type="hidden" name="id" value={message.id} />
              <input type="hidden" name="is_read" value={String(!message.is_read)} />
              <button type="submit" className={btnSecondary}>
                {message.is_read ? "Marquer non lu" : "Marquer lu"}
              </button>
            </form>
            <a href={`mailto:${message.email}?subject=Re: votre message`} className={btnPrimary}>
              Répondre
            </a>
            <form action={removeMessage}>
              <input type="hidden" name="id" value={message.id} />
              <ConfirmDeleteButton confirmMessage="Supprimer ce message ?">
                Supprimer
              </ConfirmDeleteButton>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
