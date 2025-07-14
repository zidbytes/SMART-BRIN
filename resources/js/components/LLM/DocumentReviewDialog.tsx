import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as React from 'react';

import { documentOptions } from '@/components/LLM/SelectDocuments';
import type { FieldTemplate } from '../LLM/FormUploadDocument';
import { fieldTemplates } from '../LLM/FormUploadDocument';
import { StyledSelect } from '../LLM/SelectFormRiview';

export type DocumentKey = 'publikasi-global' | 'kekayaan-intelektual' | 'perjanjian-kerjasama' | 'purwarupa' | 'studi-lanjut' | 'pdvr';

export type DocumentType = 'Publikasi' | 'KI' | 'PKS' | 'Purwarupa' | 'StudiLanjut' | 'PDVR';

const mapToDocumentType = (key: DocumentKey): DocumentType => {
    switch (key) {
        case 'publikasi-global':
            return 'Publikasi';
        case 'kekayaan-intelektual':
            return 'KI';
        case 'perjanjian-kerjasama':
            return 'PKS';
        case 'purwarupa':
            return 'Purwarupa';
        case 'studi-lanjut':
            return 'StudiLanjut';
        case 'pdvr':
            return 'PDVR';
        default:
            return 'Publikasi';
    }
};

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Record<string, string>) => void;
    metadata: Record<string, string>;
    setMetadata: (data: Record<string, string>) => void;
    documentKey: DocumentKey;
    mode: 'review' | 'manual';
}

export function DocumentReviewDialog({ open, onClose, onSubmit, metadata, setMetadata, documentKey, mode }: Props) {
    const documentType = mapToDocumentType(documentKey);

    const handleChange = (key: string, value: string) => {
        setMetadata({ ...metadata, [key]: value });
    };

    const fullDocumentTitle = React.useMemo(() => {
        const option = documentOptions.find((opt) => opt.value === documentKey);
        return option ? `REVIEW ${option.label.toUpperCase()}` : `REVIEW DOKUMEN ${documentType.toUpperCase()}`;
    }, [documentKey, documentType]);

    if (!metadata) return null;

    const fields: FieldTemplate[] = fieldTemplates[documentType] || [];

    const dialogTitle = mode === 'manual' ? 'Form Input Manual' : fullDocumentTitle;
    const dialogDescription = mode === 'manual' 
        ? 'Silakan isi semua data yang diperlukan di bawah ini.' 
        : 'Silakan cek kembali dan lengkapi data yang kosong.';

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="scrollbar-hidden max-h-[90vh] w-full overflow-y-scroll bg-white text-black sm:max-w-[600px] md:ml-[105px] [&>button]:hidden"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(metadata);
                    }}
                >
                    <DialogHeader className="font-poppins items-center text-[#E62F2A]">
                        <DialogTitle className='items-center text-center'>{dialogTitle}</DialogTitle>
                        <DialogDescription className="mt-2">{dialogDescription}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {fields.map((field) => (
                            <div key={field.name} className="grid gap-2">
                                <Label htmlFor={field.name}>{field.label}</Label>
                                {field.type === 'select' ? (
                                    <StyledSelect
                                        value={metadata[field.name] || ''}
                                        onValueChange={(value) => handleChange(field.name, value)}
                                        placeholder={`-- Pilih ${field.label} --`}
                                        options={field.options || []}
                                    />
                                ) : (
                                    <Input
                                        id={field.name}
                                        type={field.type}
                                        value={metadata[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        placeholder={field.placeholder || ''}
                                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="cursor-pointer bg-[#fdaaa8] text-white hover:text-white hover:bg-[#E62F2A]">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="cursor-pointer bg-[#fdaaa8] text-white hover:bg-[#E62F2A]">
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
