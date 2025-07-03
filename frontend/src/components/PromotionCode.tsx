import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Collapse,
  Paper,
  Divider
} from '@mui/material';
import { LocalOffer, Check, Clear } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import API_URLS from '../config/api';

interface PromotionCodeProps {
  originalAmount: number;
  onPromotionApplied: (promotionData: PromotionData | null) => void;
  disabled?: boolean;
}

interface PromotionData {
  code: string;
  name: string;
  discountAmount: number;
  finalAmount: number;
}

interface PromotionValidationResult {
  valid: boolean;
  promotion?: {
    id: number;
    code: string;
    name: string;
    discountType: string;
    discountValue: number;
  };
  discountAmount?: number;
  finalAmount?: number;
  message?: string;
}

const PromotionCode: React.FC<PromotionCodeProps> = ({
  originalAmount,
  onPromotionApplied,
  disabled = false
}) => {
  const { t } = useTranslation();
  const [promotionCode, setPromotionCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<PromotionValidationResult | null>(null);
  const [appliedPromotion, setAppliedPromotion] = useState<PromotionData | null>(null);
  const [showPromotionInput, setShowPromotionInput] = useState(false);

  const validatePromotion = async () => {
    if (!promotionCode.trim()) {
      setValidationResult({
        valid: false,
        message: 'Vui lòng nhập mã khuyến mãi'
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        API_URLS.PROMOTION.validate,
        {
          code: promotionCode.trim().toUpperCase(),
          orderAmount: originalAmount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result: PromotionValidationResult = response.data;
      setValidationResult(result);

      if (result.valid && result.promotion && result.discountAmount && result.finalAmount) {
        const promotionData: PromotionData = {
          code: result.promotion.code,
          name: result.promotion.name,
          discountAmount: result.discountAmount,
          finalAmount: result.finalAmount
        };
        setAppliedPromotion(promotionData);
        onPromotionApplied(promotionData);
      } else {
        setAppliedPromotion(null);
        onPromotionApplied(null);
      }
    } catch (error) {
      console.error('Error validating promotion:', error);
      setValidationResult({
        valid: false,
        message: 'Có lỗi xảy ra khi kiểm tra mã khuyến mãi. Vui lòng thử lại.'
      });
      setAppliedPromotion(null);
      onPromotionApplied(null);
    } finally {
      setIsLoading(false);
    }
  };

  const removePromotion = () => {
    setPromotionCode('');
    setValidationResult(null);
    setAppliedPromotion(null);
    setShowPromotionInput(false);
    onPromotionApplied(null);
  };

  const handlePromotionCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase();
    setPromotionCode(value);
    // Reset validation when user types
    if (validationResult) {
      setValidationResult(null);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      {!appliedPromotion ? (
        <Box>
          {!showPromotionInput ? (
            <Button
              variant="outlined"
              startIcon={<LocalOffer />}
              onClick={() => setShowPromotionInput(true)}
              disabled={disabled}
              fullWidth
              sx={{ mb: 1 }}
            >
              Áp dụng mã khuyến mãi
            </Button>
          ) : (
            <Paper elevation={1} sx={{ p: 2, border: '1px dashed #1976d2' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalOffer sx={{ mr: 1, fontSize: 20 }} />
                Mã khuyến mãi
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập mã khuyến mãi"
                  value={promotionCode}
                  onChange={handlePromotionCodeChange}
                  disabled={isLoading || disabled}
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
                <Button
                  variant="contained"
                  onClick={validatePromotion}
                  disabled={isLoading || !promotionCode.trim() || disabled}
                  sx={{ minWidth: 80 }}
                >
                  {isLoading ? <CircularProgress size={20} /> : 'Áp dụng'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowPromotionInput(false)}
                  disabled={isLoading}
                  sx={{ minWidth: 60 }}
                >
                  Hủy
                </Button>
              </Box>

              <Collapse in={!!validationResult}>
                {validationResult && (
                  <Alert 
                    severity={validationResult.valid ? 'success' : 'error'}
                    sx={{ mt: 1 }}
                  >
                    {validationResult.message || 
                     (validationResult.valid ? 'Áp dụng mã khuyến mãi thành công!' : 'Mã khuyến mãi không hợp lệ')}
                  </Alert>
                )}
              </Collapse>
            </Paper>
          )}
        </Box>
      ) : (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            backgroundColor: '#e8f5e8', 
            border: '1px solid #4caf50' 
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', color: '#2e7d32' }}>
                <Check sx={{ mr: 1, fontSize: 20 }} />
                Mã khuyến mãi đã áp dụng
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                {appliedPromotion.code} - {appliedPromotion.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giảm: {appliedPromotion.discountAmount.toLocaleString('vi-VN')} vnđ
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<Clear />}
              onClick={removePromotion}
              disabled={disabled}
              sx={{ color: '#d32f2f' }}
            >
              Gỡ
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default PromotionCode;
