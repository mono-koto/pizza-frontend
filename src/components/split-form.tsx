"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PieChart, Plus, XCircle } from "lucide-react";
import React, { Fragment, useCallback } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import SplitItem from "./split-form-item";

interface SplitFormProps {}

export type SplitFormInputs = {
  splits: {
    address: string;
    portion: number;
  }[];
};

const SplitForm: React.FC<SplitFormProps> = ({}) => {
  const {
    register,
    control,
    formState: { errors, touchedFields },
  } = useForm<SplitFormInputs>({
    mode: "onTouched",

    defaultValues: {
      splits: Array.from({ length: 2 }).map(() => ({
        address: "",
        portion: 100,
      })),
    },
  });
  // const onSubmit: SubmitHandler<SplitFormInputs> = (data) => console.log(data);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "splits",
    }
  );

  const [parent] = useAutoAnimate(/* optional config */);

  const addRecipient = useCallback(() => {
    prepend({
      address: "",
      portion: 100,
    });
  }, [prepend]);

  return (
    <div className='w-full space-y-4'>
      <div className='flex flex-row flex-wrap justify-between'>
        <h3 className='text-2xl mb-4'>Create a Splitter</h3>

        <Button variant='outline' onClick={addRecipient}>
          <PieChart className='w-4 h-4 mr-4' />
          Add recipient
        </Button>
      </div>

      <div className='space-y-2'>
        <div className='grid grid-cols-12 gap-x-3'>
          <span className='col-span-8 text-xs ml-1'>Address</span>
          <span className='col-span-2 text-xs ml-1'>Portion</span>
          <span className='col-span-1'></span>
        </div>
        <div className='grid grid-cols-12 gap-3 items-baseline' ref={parent}>
          {fields.map((field, index) => (
            <SplitItem
              key={field.id}
              field={field}
              index={index}
              remove={remove}
              register={register}
            />
          ))}
        </div>
      </div>
      <Button className='w-full'>Create {fields.length}-way Splitter</Button>
    </div>
  );
};

export default SplitForm;
