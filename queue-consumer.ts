export interface Env {
  MUSICHUB_APP: Fetcher;
  INTERNAL_QUEUE_SECRET: string;
}

type Message = { generationId: string };

type QueueMessage<T> = {
  body: T;
  ack: () => void;
};

type MessageBatch<T> = {
  messages: QueueMessage<T>[];
};

type QueueHandler<E> = {
  queue: (batch: MessageBatch<Message>, env: E) => Promise<void>;
};

const handler: QueueHandler<Env> = {
  async queue(batch, env) {
    for (const msg of batch.messages) {
      const r = await env.MUSICHUB_APP.fetch(
        "https://internal/api/internal/process-generation",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-musichub-queue-secret": env.INTERNAL_QUEUE_SECRET,
          },
          body: JSON.stringify(msg.body),
        },
      );

      if (!r.ok) {
        throw new Error(`generation processor returned ${r.status}`);
      }

      msg.ack();
    }
  },
};

export default handler;
