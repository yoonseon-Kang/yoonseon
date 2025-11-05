#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import os

# 입력 파일 경로
input_files = [
    'src/data/전국통합식품영양성분정보표준데이터-20250908.xls',
    'src/data/전국통합식품영양성분정보_가공식품_표준데이터-20250908.xls',
    'src/data/전국통합식품영양성분정보_음식_표준데이터-20250908.xls'
]

# 출력 파일 경로
output_files = [
    'public/nutrition-data-1.csv',
    'public/nutrition-data-2.csv',
    'public/nutrition-data-3.csv'
]

def convert_xls_to_csv(input_file, output_file):
    try:
        print(f'변환 중: {input_file} -> {output_file}')

        # XLS 파일 읽기 (헤더가 1번 행에 있음)
        df = pd.read_excel(input_file, engine='xlrd', header=1)

        # 불필요한 컬럼 제거 (Unnamed 컬럼들)
        df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

        # CSV로 저장 (UTF-8 인코딩, BOM 포함)
        df.to_csv(output_file, index=False, encoding='utf-8-sig')

        print(f'✓ 완료: {output_file} ({len(df)}행, {len(df.columns)}컬럼)')
        return True
    except Exception as e:
        print(f'✗ 오류: {input_file} - {str(e)}')
        return False

if __name__ == '__main__':
    print('=' * 60)
    print('전국통합식품영양성분정보 XLS -> CSV 변환')
    print('=' * 60)

    success_count = 0
    for input_file, output_file in zip(input_files, output_files):
        if os.path.exists(input_file):
            if convert_xls_to_csv(input_file, output_file):
                success_count += 1
        else:
            print(f'✗ 파일을 찾을 수 없습니다: {input_file}')

    print('=' * 60)
    print(f'변환 완료: {success_count}/{len(input_files)}개 파일')
    print('=' * 60)
