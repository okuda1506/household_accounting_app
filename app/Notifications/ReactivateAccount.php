<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class ReactivateAccount extends Notification
{
    use Queueable;

    /**
     * The password reset token.
     *
     * @var string
     */
    public $token;

    /**
     * The callback that should be used to create the reset URL.
     *
     * @var \Closure|null
     */
    public static $createUrlCallback;

    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $reactivateUrl = url(config('app.url') . "/reactivate-account/{$this->token}?email=" . urlencode($notifiable->getEmailForPasswordReset()));

        return (new MailMessage)
            ->subject(Lang::get('アカウントの利用再開'))
            ->line(Lang::get('アカウントの利用を再開するには、以下のボタンをクリックしてパスワードを再設定してください。'))
            ->action(Lang::get('パスワードを再設定して利用を再開する'), $reactivateUrl)
            ->line(Lang::get('このリンクは :count 分で有効期限が切れます。', ['count' => config('auth.passwords.' . config('auth.defaults.passwords') . '.expire')]))
            ->line(Lang::get('もしこのメールに心当たりがない場合は、このメールを破棄してください。'));
    }
}
