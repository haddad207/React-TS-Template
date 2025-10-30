import { Box, Stack, Tooltip } from '@mui/material';
import {
  Edit,
  Delete,
  Lock,
  LockOpen,
  AdminPanelSettings,
  Person,
  Refresh
} from '@mui/icons-material';
import { ActionButton } from '../UserManagement.styles';
import type UserActionsCellProps from '../../../models/user_management/UserActionsCellProps.ts';


export default function UserActionsCell({
  user,
  onPromote,
  onDemote,
  onToggleLock,
  onDelete,
  onResetPassword,
  isMobile = false
}: UserActionsCellProps) {
  const isAdmin = user.roles.includes('Admin');

  if (isMobile) {
    return (
      <Stack spacing={1} sx={{ minWidth: 120 }}>
        <Stack direction="row" spacing={0.5}>
          {!isAdmin ? (
            <Tooltip title="Promote to Admin">
              <ActionButton
                variant="promote"
                size="small"
                onClick={() => onPromote(user)}
              >
                <AdminPanelSettings fontSize="small" />
              </ActionButton>
            </Tooltip>
          ) : (
            <Tooltip title="Demote from Admin">
              <ActionButton
                variant="demote"
                size="small"
                onClick={() => onDemote(user)}
              >
                <Person fontSize="small" />
              </ActionButton>
            </Tooltip>
          )}

          <Tooltip title={user.isActive ? 'Lock User' : 'Unlock User'}>
            <ActionButton
              variant={user.isActive ? 'lock' : 'unlock'}
              size="small"
              onClick={() => onToggleLock(user)}
            >
              {user.isActive ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
            </ActionButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Reset Password">
            <ActionButton
              variant="reset"
              size="small"
              onClick={() => onResetPassword(user)}
            >
              <Refresh fontSize="small" />
            </ActionButton>
          </Tooltip>

          <Tooltip title="Delete User">
            <ActionButton
              variant="delete"
              size="small"
              onClick={() => onDelete(user)}
            >
              <Delete fontSize="small" />
            </ActionButton>
          </Tooltip>
        </Stack>
      </Stack>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {!isAdmin ? (
        <Tooltip title="Promote to Admin">
          <ActionButton
            variant="promote"
            size="small"
            onClick={() => onPromote(user)}
          >
            <AdminPanelSettings fontSize="small" />
          </ActionButton>
        </Tooltip>
      ) : (
        <Tooltip title="Demote from Admin">
          <ActionButton
            variant="demote"
            size="small"
            onClick={() => onDemote(user)}
          >
            <Person fontSize="small" />
          </ActionButton>
        </Tooltip>
      )}

      <Tooltip title={user.isActive ? 'Lock User' : 'Unlock User'}>
        <ActionButton
          variant={user.isActive ? 'lock' : 'unlock'}
          size="small"
          onClick={() => onToggleLock(user)}
        >
          {user.isActive ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
        </ActionButton>
      </Tooltip>

      <Tooltip title="Reset Password">
        <ActionButton
          variant="reset"
          size="small"
          onClick={() => onResetPassword(user)}
        >
          <Refresh fontSize="small" />
        </ActionButton>
      </Tooltip>

      <Tooltip title="Delete User">
        <ActionButton
          variant="delete"
          size="small"
          onClick={() => onDelete(user)}
        >
          <Delete fontSize="small" />
        </ActionButton>
      </Tooltip>
    </Box>
  );
}