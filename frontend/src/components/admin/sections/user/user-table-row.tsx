import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from '../../components/label';
import { Iconify } from '../../components/iconify';

// ----------------------------------------------------------------------

export type UserProps = {
    id: number;
    code: string;
    name: string;
    cardId: string;
    email: string;
    password: string;
    gender: boolean;
    status: boolean;
    phoneNumber: string;
    avatar: string | null;
    address: string;
    role: {
        id: number;
        name: string;
    };
};

type UserTableRowProps = {
    row: UserProps;
    selected: boolean;
    onSelectRow: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export function UserTableRow({ row, selected, onSelectRow, onEdit, onDelete }: UserTableRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
                </TableCell>

                <TableCell component="th" scope="row">
                    <Box
                        sx={{
                            gap: 2,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar alt={row.name} src={row.avatar ?? undefined} />
                        {row.name}
                    </Box>
                </TableCell>

                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.role?.name}</TableCell>
                <TableCell>{row.gender ? 'Nam' : 'Nữ'}</TableCell>

                <TableCell>
                    <Label color={row.status ? 'success' : 'error'}>
                        {row.status ? 'Hoạt động' : 'Khóa'}
                    </Label>
                </TableCell>

                <TableCell align="right">
                    <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleClosePopover();
                            onEdit();
                        }}
                    >
                        <Iconify icon="solar:pen-bold" />
                        Chỉnh sửa
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            handleClosePopover();
                            onDelete();
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Xóa
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
}