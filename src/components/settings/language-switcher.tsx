'use client';

import { SUPPORTED_LOCALES } from "@/utils/constants";
import { Button, ButtonGroup} from "@mui/material";
import useLocaleChanger from 'src/hooks/use-locale-changer';

export default function LanguageSwitcher() {
    const { currentLocale, changeLocale } = useLocaleChanger();

    return (
        <ButtonGroup variant="outlined" aria-label="Basic button group">
            {SUPPORTED_LOCALES.map((lang) => (
                <Button variant={currentLocale === lang ? 'contained' : 'outlined'} key={lang} onClick={() => changeLocale(lang)}>
                    {lang}
                </Button>
            ))}
        </ButtonGroup>
    );
}