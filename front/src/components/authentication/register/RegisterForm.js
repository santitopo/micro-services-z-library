import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
import { Stack, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { registerAdmin, registerThroughInvite } from 'src/services/authService';
import ErrorMessage from 'src/components/ErrorMessage';
import jwtDecode from 'jwt-decode';

export default function RegisterForm({ registrationToken }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: '',
    last_name: '',
    email: '',
    organization_name: '',
    password: ''
  });

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Nombre requerido'),
    last_name: Yup.string().required('Apellido requerido'),
    email: Yup.string().email('El email tiene que ser válido').required('Email requerido'),
    organization_name: Yup.string().required('Nombre de la organizacion requerido'),
    password: Yup.string().required('Contraseña requerida')
  });

  useEffect(() => {
    if (registrationToken) {
      const invitationInfo = jwtDecode(registrationToken);
      setInitialValues({
        email: invitationInfo.email,
        organization_name: invitationInfo.organizationName
      });
    }
  }, [registrationToken]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: async () => {
      try {
        if (registrationToken) {
          const data = { ...formik.values };
          delete data.email;
          delete data.organization_name;

          await registerThroughInvite(data, registrationToken);
        } else {
          await registerAdmin(formik.values);
        }

        navigate('/login', { replace: true });
      } catch (error) {
        setError(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      {error && <ErrorMessage />}
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Nombre"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />

              <TextField
                fullWidth
                label="Apellido"
                {...getFieldProps('last_name')}
                error={Boolean(touched.last_name && errors.last_name)}
                helperText={touched.last_name && errors.last_name}
              />
            </Stack>

            <TextField
              fullWidth
              disabled={registrationToken}
              autoComplete="username"
              type="email"
              label="Email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              disabled={registrationToken}
              label="Nombre de la Organizacion"
              {...getFieldProps('organization_name')}
              error={Boolean(touched.organization_name && errors.organization_name)}
              helperText={touched.organization_name && errors.organization_name}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Registrarme
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}
