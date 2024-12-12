import { LoadingButton } from '@mui/lab';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSnackbarState } from '@/hooks/useGlobalState';
import { styles } from '@/styles';
import useSWR from 'swr';
import { fetcher } from '@/utils';
import { NextPage } from 'next';

type Ceremony = {
  name: string;
  event_date: string;
  location: string;
  description: string;
  ceremony_okyo_groups_attributes: { id: number | null; okyo_id: string; order: number }[];
};

const CreateCeremonyForm: NextPage = () => {
  const router = useRouter();
  const [, setSnackbar] = useSnackbarState();
  const [isLoading, setIsLoading] = useState(false);
  const [ceremony, setCeremony] = useState<Ceremony>({
    name: '',
    event_date: '',
    location: '',
    description: '',
    ceremony_okyo_groups_attributes: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: okyosData } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/okyo`, fetcher);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!ceremony.name) newErrors.name = '名前を入力してください';
    if (!ceremony.event_date) newErrors.event_date = '日付を入力してください';

    ceremony.ceremony_okyo_groups_attributes.forEach((group, index) => {
      if (!group.okyo_id) {
        newErrors[`okyo_${index}`] = `お経 ${index + 1} を選択してください`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('access-token'),
        client: localStorage.getItem('client'),
        uid: localStorage.getItem('uid'),
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/ceremony`,
        { ceremony },
        { headers }
      );

      setSnackbar({
        message: '式典を作成しました',
        severity: 'success',
        pathname: router.pathname,
      });

      router.push(`/current/ceremony/${response.data.id}/show`);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError && err.response
          ? err.response.data.message || '不明なエラーが発生しました'
          : 'ネットワークエラーが発生しました';

      console.error('Submission error:', err);
      setSnackbar({
        message: `作成に失敗しました: ${errorMessage}`,
        severity: 'error',
        pathname: router.pathname,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addOkyoGroup = () => {
    setCeremony((prev) => ({
      ...prev,
      ceremony_okyo_groups_attributes: [
        ...prev.ceremony_okyo_groups_attributes,
        { id: null, okyo_id: '', order: prev.ceremony_okyo_groups_attributes.length + 1 },
      ],
    }));
  };

  const removeOkyoGroup = (index: number) => {
    const updatedGroups = ceremony.ceremony_okyo_groups_attributes.filter((_, i) => i !== index);
    setCeremony({
      ...ceremony,
      ceremony_okyo_groups_attributes: updatedGroups,
    });
  };

  const handleOkyoChange = (okyoId: string, index: number) => {
    const updatedGroups = [...ceremony.ceremony_okyo_groups_attributes];
    updatedGroups[index] = { ...updatedGroups[index], okyo_id: okyoId };
    setCeremony({ ...ceremony, ceremony_okyo_groups_attributes: updatedGroups });
  };

  return (
    <Box css={styles.pageMinHeight} sx={{ maxWidth: '800px', mx: 'auto', p: 2 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        式典の新規作成
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="名前"
          value={ceremony.name}
          onChange={(e) => setCeremony({ ...ceremony, name: e.target.value })}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="日付"
          type="date"
          value={ceremony.event_date}
          onChange={(e) => setCeremony({ ...ceremony, event_date: e.target.value })}
          error={!!errors.event_date}
          helperText={errors.event_date}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="場所"
          value={ceremony.location}
          onChange={(e) => setCeremony({ ...ceremony, location: e.target.value })}
          error={!!errors.location}
          helperText={errors.location}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="説明"
          value={ceremony.description}
          onChange={(e) => setCeremony({ ...ceremony, description: e.target.value })}
          error={!!errors.description}
          helperText={errors.description}
          fullWidth
          sx={{ mb: 2 }}
        />

        {ceremony.ceremony_okyo_groups_attributes.map((group, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormControl fullWidth sx={{ mr: 2 }}>
              <InputLabel>お経 {index + 1}</InputLabel>
              <Select
                value={group.okyo_id}
                onChange={(e) => handleOkyoChange(e.target.value, index)}
                error={!!errors[`okyo_${index}`]}
              >
                {okyosData?.map((okyo) => (
                  <MenuItem key={okyo.id} value={okyo.id}>
                    {okyo.name}
                  </MenuItem>
                ))}
              </Select>
              {errors[`okyo_${index}`] && (
                <Typography color="error" variant="caption">
                  {errors[`okyo_${index}`]}
                </Typography>
              )}
            </FormControl>
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeOkyoGroup(index)}
            >
              削除
            </Button>
          </Box>
        ))}

        <Button variant="contained" color="secondary" onClick={addOkyoGroup} sx={{ mb: 2 }}>
          お経を追加
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <LoadingButton
            type="submit"
            loading={isLoading}
            variant="contained"
            color="primary"
            sx={{
              color: 'white',
              textTransform: 'none',
              fontSize: 16,
              borderRadius: 2,
              width: 100,
              boxShadow: 'none',
            }}
          >
            作成
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
};

export default CreateCeremonyForm;