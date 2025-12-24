-- 用户操作日志表（记录管理员对用户的操作）
CREATE TABLE IF NOT EXISTS public.user_action_logs (
    id BIGSERIAL PRIMARY KEY,
    target_user_id BIGINT NOT NULL REFERENCES public.users(id),
    operator_id BIGINT NOT NULL REFERENCES public.users(id),
    action VARCHAR(30) NOT NULL,
    reason VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 操作说明: MUTE(禁言), UNMUTE(解除禁言), BAN(封禁), UNBAN(解封), ROLE_CHANGE(角色变更)

CREATE INDEX idx_user_action_logs_target ON public.user_action_logs(target_user_id);
