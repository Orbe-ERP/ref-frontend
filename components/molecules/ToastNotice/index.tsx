import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as S from './styles';

interface ToastNoticeProps {
    title?: string;
    message: string;
    
    titleColor?: string;
    messageColor?: string;
    backgroundColor?: string;
    iconColor?: string;

    iconName?: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
    showIcon?: boolean;
    
    isTablet?: boolean;
    isDesktop?: boolean;
    isWeb?: boolean;
    
    titleSize?: number;
    messageSize?: number;
}

export const ToastNotice: React.FC<ToastNoticeProps> = ({
    title,
    message,
    titleColor,
    messageColor,
    backgroundColor,
    iconColor,
    iconName = 'information-circle-outline',
    iconSize = 20,
    showIcon = true,
    isTablet = false,
    isDesktop = false,
    isWeb = false,
    titleSize = 14,
    messageSize = 13,
}) => {
    const defaultMessageColor = title ? undefined : messageColor;
  
    return (
        <S.ToastNotice
            isTablet={isTablet}
            isDesktop={isDesktop}
            isWeb={isWeb}
            backgroundColor={backgroundColor}   
        >
            {showIcon && (
                <S.ToastIcon>
                    <Ionicons
                        name={iconName}
                        size={iconSize}
                        color={iconColor}
                    />
                </S.ToastIcon>
            )}
        
            <S.ToastContent>
                {title && (
                    <S.ToastTitle 
                        color={titleColor}
                        fontSize={titleSize}
                    >
                        {title}
                    </S.ToastTitle>
                )}
                <S.ToastText 
                    color={defaultMessageColor || messageColor}
                    fontSize={messageSize}
                >
                    {message}
                </S.ToastText>
            </S.ToastContent>
        </S.ToastNotice>
    );
};