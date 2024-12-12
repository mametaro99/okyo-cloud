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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSnackbarState } from '@/hooks/useGlobalState';
import { styles } from '@/styles';
import useSWR from 'swr';
import { fetcher } from '@/utils';
import camelcaseKeys from 'camelcase-keys';
import { NextPage } from 'next';

// Define types for ceremony and okyo group
interface OkyoGroup {
  id: number | null;
  okyo_id: string;
  order: number;
}

interface Ceremony {
  name: string;
  event_date: Date;
  location: string;
  description: string;
  ceremony_okyo_groups_attributes: OkyoGroup[];
}

const CeremonyForm: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [, setSnackbar] = useSnackbarState();

  const [isLoading, setIsLoading] = useState(false);
  const [ceremony, setCeremony] = useState<Ceremony>({
    name: '',
    event_date: new Date(),
    location: '',
    description: '',
    ceremony_okyo_groups_attributes: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: okyosData } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/okyo`, fetcher);
  const { data: ceremonyData } = useSWR(
    id ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/ceremony/${id}` : null,
    fetcher
  );

  useEffect(() => {
    if (ceremonyData) {

      const camelcasedCeremony = {
        name: ceremonyData.name,
        event_date: ceremonyData.event_date,
        location: ceremonyData.location,
        description: ceremonyData.description,
      };
      const okyoGroups: OkyoGroup[] = ceremonyData.ceremony_okyo_groups_attributes?.map((group: any) => ({
        okyo_id: group.okyoId,
        order: group.order,
      })) || [];
      setCeremony({
        ...camelcasedCeremony,
        ceremony_okyo_groups_attributes: okyoGroups,
      });
    }
  }, [ceremonyData]);

  console.log(ceremonyData);

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
        'access-token': localStorage.getItem('access-token') || '',
        client: localStorage.getItem('client') || '',
        uid: localStorage.getItem('uid') || '',
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/ceremony/${id}`,
        { ceremony },
        { headers }
      );

      setSnackbar({
        message: '式典を更新しました',
        severity: 'success',
        pathname: router.pathname,
      });

      router.push(`/current/ceremony/${id}/show`);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError && err.response
          ? err.response.data.message || '不明なエラーが発生しました'
          : 'ネットワークエラーが発生しました';

      console.error('Submission error:', err);
      setSnackbar({
        message: `更新に失敗しました: ${errorMessage}`,
        severity: 'error',
        pathname: router.pathname,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const headers = {
        'access-token': localStorage.getItem('access-token') || '',
        client: localStorage.getItem('client') || '',
        uid: localStorage.getItem('uid') || '',
      };

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/ceremony/${id}`,
        { headers }
      );

      setSnackbar({
        message: '式典を削除しました',
        severity: 'success',
        pathname: router.pathname,
      });

      router.push('/current/ceremony');
    } catch (err) {
      console.error('Delete error:', err);
      setSnackbar({
        message: '削除に失敗しました',
        severity: 'error',
        pathname: router.pathname,
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleOkyoChange = (value: string, index: number) => {
    const updatedGroups = [...ceremony.ceremony_okyo_groups_attributes];
    updatedGroups[index].okyo_id = value;
    setCeremony({ ...ceremony, ceremony_okyo_groups_attributes: updatedGroups });
  };

  const removeOkyoGroup = (index: number) => {
    const updatedGroups = ceremony.ceremony_okyo_groups_attributes.filter((_, i) => i !== index);
    setCeremony({ ...ceremony, ceremony_okyo_groups_attributes: updatedGroups });
  };

  const addOkyoGroup = () => {
    setCeremony({
      ...ceremony,
      ceremony_okyo_groups_attributes: [
        ...(ceremony.ceremony_okyo_groups_attributes || []),
        { id: null, okyo_id: '', order: (ceremony.ceremony_okyo_groups_attributes?.length || 0) + 1 },
      ],
    });
  };

  return (
    <Box css={styles.pageMinHeight} sx={{ maxWidth: '800px', mx: 'auto', p: 2 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        式典の編集
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
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="説明"
          value={ceremony.description}
          onChange={(e) => setCeremony({ ...ceremony, description: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />

        {ceremony.ceremony_okyo_groups_attributes?.map((group: OkyoGroup, index: number) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormControl fullWidth sx={{ mr: 2 }}>
              <InputLabel>お経 {index + 1}</InputLabel>
              <Select
                value={group.okyo_id}
                onChange={(e) => handleOkyoChange(e.target.value, index)}
                error={!!errors[`okyo_${index}`]}
              >
                {okyosData?.map((okyo: { id: string; name: string }) => (
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
        {/* フォーム要素は省略（上記コードと同様） */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <LoadingButton
            type="submit"
            loading={isLoading}
            variant="contained"
            color="primary"
          >
            更新
          </LoadingButton>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            削除
          </Button>
        </Box>
      </form>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>削除の確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            本当にこの式典を削除しますか？ この操作は元に戻せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CeremonyForm;
