import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Impor aset gambar Anda
import patternBg from '../../assets/bg-pattern2.png';
import Logobrin from '../../assets/Logo BRIN_Lanscape_Colour.png'; // Pastikan path ke logo ini benar

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

            {/* Container utama untuk latar belakang dan penempatan di tengah */}
            <div
                className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-[#535151]"
                style={{
                    backgroundImage: `url(${patternBg})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: 'cover', // 'cover' bisa lebih baik untuk beberapa pola
                }}
            >
                {/* Card Form Registrasi */}
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-gray-400/50">
                    {/* Header dengan Logo */}
                    <div className="mb-4 text-center">
                        <img src={Logobrin} alt="Logo BRIN" className="mx-auto h-20 w-auto" />
                        <h1 className="mt-2 text-3xl font-bold text-[#535151]">SMART BRIN</h1>
                        <p className=" text-sm text-gray-500">Enter your details to create an account.</p>
                    </div>

                    <form className="space-y-2" onSubmit={submit}>
                        {/* Input Nama */}
                        <div>
                            <Label htmlFor="name" className="text-gray-700">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Your full name"
                                className="mt-1 h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-base transition-colors focus:border-[#E62F2A] focus:bg-white focus:ring-1 focus:ring-[#E62F2A]"
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Input Email */}
                        <div>
                            <Label htmlFor="email" className="text-gray-700">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="nama@brin.go.id"
                                className="mt-1 h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-base transition-colors focus:border-[#E62F2A] focus:bg-white focus:ring-1 focus:ring-[#E62F2A]"
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Input Password */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative mt-1">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Create a password"
                                    className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 pr-12 text-base transition-colors focus:border-[#E62F2A] focus:bg-white focus:ring-1 focus:ring-[#E62F2A]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-800"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Input Konfirmasi Password */}
                        <div>
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <div className="relative mt-1">
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="Confirm your password"
                                    className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 pr-12 text-base transition-colors focus:border-[#E62F2A] focus:bg-white focus:ring-1 focus:ring-[#E62F2A]"
                                />
                                 <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-800"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        {/* Tombol Submit */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="cursor-pointer h-14 w-full rounded-xl bg-[#E62F2A] text-lg text-white shadow-md transition-all duration-300 hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E62F2A] focus:ring-offset-2"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </div>

                        {/* Link ke Login */}
                        <div className="pt-2 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <TextLink href={route('login')} className="font-bold text-[#E62F2A] underline-offset-4 hover:underline">
                                Log in
                            </TextLink>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}