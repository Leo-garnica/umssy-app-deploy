import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SELECT_ITEM_CONTRAST_CLASS } from '@/shared/constants/select.constants';
import { FieldError } from './personal-data/field-error';
import { RequiredMark } from './personal-data/required-mark';

type DirectRegistrationSelectProps = {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export function DirectRegistrationSelect({ id, label, options, value, error, onChange }: DirectRegistrationSelectProps) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 text-xs font-semibold text-ink">
        {label}<RequiredMark />
      </Label>
      <Select name={id} value={value || null} onValueChange={next => onChange(next ?? '')}>
        <SelectTrigger id={id} aria-required="true" aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full rounded-md border-border bg-surface px-3 text-base text-ink focus-visible:border-accent focus-visible:ring-interaction data-[size=default]:h-11">
          <SelectValue placeholder="Selecciona una opción" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {options.map(option => <SelectItem key={option} value={option} className={SELECT_ITEM_CONTRAST_CLASS}>{option}</SelectItem>)}
        </SelectContent>
      </Select>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
