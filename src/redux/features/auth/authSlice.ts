
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/axios";

// ========================================
// INTERFACES
// ========================================

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface EmployerProfile {
  id?: string;
  userId?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  phone?: string;
  companyName?: string;
  companyEmail?: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: string;
  companyDescription?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  status?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
  employer?: EmployerProfile | null;
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    id?: string;
    user?: User;
    employer?: EmployerProfile;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  };
}

interface AuthState {
  user: User | null;
  employer: EmployerProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SeekerRegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface EmployerRegisterData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  companyEmail: string;
  companyWebsite?: string;
  industry: string;
  companySize: string;
  companyDescription?: string;
  country: string;
  state: string;
  city: string;
  address?: string;
}

// ========================================
// INITIAL STATE
// ========================================

const initialState: AuthState = {
  user: null,
  employer: null,
  token: null,
  loading: false,
  error: null,
};

// ========================================
// HELPER: STORE LOGIN DATA
// ========================================

const saveAuthData = (
  token: string,
  user: User,
  employer: EmployerProfile | null,
  rememberMe = true
) => {
  if (typeof window === "undefined") return;

  // Clear old authentication information
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("employer");

  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("employer");

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem("accessToken", token);
  storage.setItem("user", JSON.stringify(user));

  if (employer) {
    storage.setItem("employer", JSON.stringify(employer));
  }
};

// ========================================
// 1. JOB SEEKER LOGIN
// POST /api/auth/login
// ========================================

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      const result = response.data;

      // Your seeker login controller returns
      // token and user at the top level.
      const token = result.token;
      const user = result.user;

      if (!token || !user) {
        return thunkAPI.rejectWithValue(
          "Login response is missing token or user."
        );
      }

      const normalizedUser: User = {
        ...user,
        role: user.role || "seeker",
      };

      saveAuthData(
        token,
        normalizedUser,
        null,
        credentials.rememberMe
      );

      return {
        success: result.success,
        message: result.message,
        token,
        user: normalizedUser,
        employer: null,
      };
    } catch (error: any) {
      console.error("SEEKER LOGIN ERROR:", error.response?.data || error);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Seeker login failed."
      );
    }
  }
);

// ========================================
// 2. JOB SEEKER REGISTRATION
// POST /api/auth/register
// ========================================

export const registerUser = createAsyncThunk<
  RegistrationResponse,
  SeekerRegisterData,
  { rejectValue: string }
>(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post(
        "/auth/register",
        userData
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "SEEKER REGISTRATION ERROR:",
        error.response?.data || error
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Seeker registration failed."
      );
    }
  }
);

// ========================================
// 3. EMPLOYER LOGIN
// POST /api/auth/employer/login
// ========================================

export const employerLogin = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/employerLogin",
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post(
        "/auth/employer/login",
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      const result = response.data;

      // Your employer login controller returns
      // token, user and employer inside data.
      const token = result.data?.token;
      const userData = result.data?.user;
      const employerData = result.data?.employer;

      if (!token || !userData) {
        return thunkAPI.rejectWithValue(
          "Employer login response is missing token or user."
        );
      }

      const normalizedUser: User = {
        ...userData,
        role: "employer",
      };

      saveAuthData(
        token,
        normalizedUser,
        employerData || null,
        credentials.rememberMe
      );

      return {
        success: result.success,
        message: result.message,
        token,
        user: normalizedUser,
        employer: employerData || null,
      };
    } catch (error: any) {
      console.error(
        "EMPLOYER LOGIN ERROR:",
        error.response?.data || error
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Employer login failed."
      );
    }
  }
);

// ========================================
// 4. EMPLOYER REGISTRATION
// POST /api/auth/employer/register
// ========================================

export const employerRegister = createAsyncThunk<
  RegistrationResponse,
  EmployerRegisterData,
  { rejectValue: string }
>(
  "auth/employerRegister",
  async (employerData, thunkAPI) => {
    try {
      const response = await api.post(
        "/auth/employer/register",
        employerData
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "EMPLOYER REGISTRATION ERROR:",
        error.response?.data || error
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Employer registration failed."
      );
    }
  }
);

// ========================================
// AUTH SLICE
// ========================================

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // LOGOUT
    logout: (state) => {
      state.user = null;
      state.employer = null;
      state.token = null;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("employer");

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("employer");
      }
    },

    // CLEAR ERROR
    clearAuthError: (state) => {
      state.error = null;
    },

    // RESTORE LOGIN AFTER REFRESH
    restoreAuth: (state) => {
      if (typeof window !== "undefined") {
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        const storedUser =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user");

        const storedEmployer =
          localStorage.getItem("employer") ||
          sessionStorage.getItem("employer");

        state.token = token;

        try {
          state.user = storedUser
            ? JSON.parse(storedUser)
            : null;

          state.employer = storedEmployer
            ? JSON.parse(storedEmployer)
            : null;
        } catch {
          state.user = null;
          state.employer = null;
          state.token = null;
        }
      }
    },
  },

  extraReducers: (builder) => {
    // ====================================
    // SEEKER LOGIN
    // ====================================

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.employer = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed.";
      });

    // ====================================
    // SEEKER REGISTRATION
    // ====================================

    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Registration failed.";
      });

    // ====================================
    // EMPLOYER LOGIN
    // ====================================

    builder
      .addCase(employerLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(employerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.employer = action.payload.employer || null;
      })
      .addCase(employerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Employer login failed.";
      });

    // ====================================
    // EMPLOYER REGISTRATION
    // ====================================

    builder
      .addCase(employerRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(employerRegister.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(employerRegister.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Employer registration failed.";
      });
  },
});

// ========================================
// EXPORT ACTIONS
// ========================================

export const {
  logout,
  clearAuthError,
  restoreAuth,
} = authSlice.actions;

export default authSlice.reducer;
