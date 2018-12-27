import { Good, GoodType } from '../../app/core/model/good.model';

export const goodsMock:Good[] = [
    {
        'id':'52e394cc-0113-423c-a1af-0bd9e97e13c6',
        'name':'+5 Dexterity Vest',
        'sellIn':10,
        'quality':20,
        'type':GoodType.STANDARD
    },
    {
        'id':'cac27241-57d6-4a63-b66a-315f96732e46',
        'name':'Aged Brie',
        'sellIn':2,
        'quality':0,
        'type':GoodType.STANDARD
    },
    {
        'id':'3c3f2f9a-72eb-4e38-8d85-c11a6783ad11',
        'name':'Elixir of the Mongoose',
        'sellIn':5,
        'quality':7,
        'type':GoodType.STANDARD
    },
    {
        'id':'883127ca-812e-4ad1-a2b4-b0639bf52d5f',
        'name':'Sulfuras, Hand of Ragnaros',
        'sellIn':2147483647,
        'quality':100,
        'type':GoodType.LEGENDARY
    },
    {
        'id':'7878418a-bbac-4c2d-be66-b9cd328701b1',
        'name':'Sulfuras, Hand of Ragnaros',
        'sellIn':2147483647,
        'quality':80,
        'type':GoodType.LEGENDARY
    },
    {
        'id':'df80682d-5c60-450f-a225-d84bc7281fc5',
        'name':'Backstage passes to a TAFKAL80ETC concert',
        'sellIn':15,
        'quality':20,
        'type':GoodType.BACKSTAGE_PASS
    },
    {
        'id':'7fa9e271-14b7-4288-8d44-98560920e990',
        'name':'Backstage passes to a TAFKAL80ETC concert',
        'sellIn':10,
        'quality':49,
        'type':GoodType.BACKSTAGE_PASS
    },
    {
        'id':'ef3a9723-7d93-44c1-b546-91b2f15b4054',
        'name':'Backstage passes to a TAFKAL80ETC concert',
        'sellIn':5,
        'quality':49,
        'type':GoodType.BACKSTAGE_PASS
    },
    {
        'id':'7fe8ee50-c0ac-47e1-b091-d08c5bc86b80',
        'name':'Conjured Mana Cake',
        'sellIn':3,
        'quality':6,
        'type':GoodType.CONJURED
    }
];
