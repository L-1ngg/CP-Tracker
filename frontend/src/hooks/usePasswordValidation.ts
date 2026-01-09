import { useMemo } from 'react';

export interface PasswordRule {
  id: string;
  label: string;
  passed: boolean;
}

export interface PasswordValidation {
  rules: PasswordRule[];
  strength: number; // 0-100
  strengthLabel: string;
  strengthColor: string;
  isValid: boolean;
}

export interface PasswordMatchValidation {
  isMatching: boolean;
  showStatus: boolean; // 只有当确认密码有输入时才显示状态
}

export function usePasswordValidation(password: string): PasswordValidation {
  return useMemo(() => {
    const rules: PasswordRule[] = [
      {
        id: 'length',
        label: '至少 6 个字符',
        passed: password.length >= 6,
      },
      {
        id: 'uppercase',
        label: '包含大写字母',
        passed: /[A-Z]/.test(password),
      },
      {
        id: 'lowercase',
        label: '包含小写字母',
        passed: /[a-z]/.test(password),
      },
      {
        id: 'number',
        label: '包含数字',
        passed: /\d/.test(password),
      },
      {
        id: 'special',
        label: '包含特殊字符',
        passed: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ];

    // 计算强度分数
    const passedCount = rules.filter((r) => r.passed).length;
    const strength = Math.round((passedCount / rules.length) * 100);

    // 确定强度标签和颜色
    let strengthLabel: string;
    let strengthColor: string;

    if (password.length === 0) {
      strengthLabel = '';
      strengthColor = 'bg-muted';
    } else if (strength < 40) {
      strengthLabel = '弱';
      strengthColor = 'bg-red-500';
    } else if (strength < 70) {
      strengthLabel = '中等';
      strengthColor = 'bg-yellow-500';
    } else {
      strengthLabel = '强';
      strengthColor = 'bg-green-500';
    }

    // 最低要求：至少 6 个字符
    const isValid = password.length >= 6;

    return {
      rules,
      strength,
      strengthLabel,
      strengthColor,
      isValid,
    };
  }, [password]);
}

export function usePasswordMatch(
  password: string,
  confirmPassword: string
): PasswordMatchValidation {
  return useMemo(() => {
    const showStatus = confirmPassword.length > 0;
    const isMatching = password === confirmPassword && password.length > 0;

    return {
      isMatching,
      showStatus,
    };
  }, [password, confirmPassword]);
}
