"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";

const NotificationItem = ({ notification, onMarkAsRead }) => {
  if (!notification) return null;

  const {
    _id,
    type,
    post,
    sender,
    content,
    createdAt,
    isRead,
  } = notification;

  const href =
    type === "like" || type === "comment"
      ? `/feed/post/${post}`
      : `/profile/${sender?.username}`;

  const timeAgo = createdAt
    ? formatDistanceToNowStrict(new Date(createdAt), {
        addSuffix: true,
      })
    : "";

  const handleClick = () => {
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(_id);
    }
  };

  return (
    <Link
      href={href}
      prefetch={false}
      onClick={handleClick}
      className={`block px-4 py-3 cursor-pointer ${!isRead ? "bg-primary/10" : ""}`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative w-10 h-10 overflow-hidden rounded-full border border-border flex-shrink-0">
          {sender?.avatar ? (
            <Image
              src={sender.avatar}
              alt={sender.displayName || "avatar"}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center font-bold text-sm">
              {sender?.displayName?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-snug">
              <span className="font-semibold">
                {sender?.displayName || "Someone"}
              </span>{" "}
              {type === "like" && "liked your post"}
              {type === "comment" && (
                <>
                  commented:{" "}
                  <span className="italic truncate block">
                    "{content}"
                  </span>
                </>
              )}
              {type === "follow" && "started following you"}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              {timeAgo}
            </p>
          </div>

          {/* Unread Indicator */}
          {!isRead && (
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          )}
        </div>
      </div>
    </Link>
  );
};

export default NotificationItem;